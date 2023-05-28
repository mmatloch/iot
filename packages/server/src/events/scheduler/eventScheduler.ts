import CronParser from 'cron-parser';
import { addSeconds, subMilliseconds } from 'date-fns';
import _ from 'lodash';
import { LessThanOrEqual } from 'typeorm';
import type { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';

import { getConfig } from '../../config';
import {
    EventMetadataOnMultipleInstances,
    EventMetadataTaskType,
    EventState,
    EventTriggerType,
} from '../../definitions/eventDefinitions';
import type { Event } from '../../entities/eventEntity';
import { createEventSubscriber } from '../../entities/eventEntitySubscriber';
import type { EventInstance } from '../../entities/eventInstanceEntity';
import { createEventInstanceSubscriber } from '../../entities/eventInstanceEntitySubscriber';
import type { EventSchedulerTask } from '../../entities/eventSchedulerTaskEntity';
import { EventSchedulerTaskState } from '../../entities/eventSchedulerTaskEntity';
import { createEventSchedulerTaskSubscriber } from '../../entities/eventSchedulerTaskEntitySubscriber';
import { EntitySubscriberEvent } from '../../entities/subscriberDefinitions';
import { getLogger } from '../../logger';
import { createEventSchedulerTasksService } from '../../services/eventSchedulerTasksService';
import { createEventsService } from '../../services/eventsService';
import { FETCH_TASKS_INTERVAL, PROCESS_SKIPPED_TASKS_INTERVAL } from './eventSchedulerConstants';
import { startLoop } from './eventSchedulerUtils';

const logger = getLogger();
const config = getConfig();

const timeZone = config.app.timeZone;

type RelativeEventMetadataMap = Map<number, Event>;

export const createEventScheduler = () => {
    const eventSchedulerTasksService = createEventSchedulerTasksService();
    const eventsService = createEventsService();

    const relativeEventMetadataMap: RelativeEventMetadataMap = new Map();

    const initialize = () => {
        logger.debug('Initializing event scheduler');

        setupEntitySubscribers();
        processSkippedTasks();
        loadRelativeEvents();

        startLoop(processSkippedTasks, () => PROCESS_SKIPPED_TASKS_INTERVAL);
    };

    const cancelEvent = async (event: Event) => {
        logger.debug({
            msg: `Canceling the '${event.displayName}' event`,
            event,
        });

        const listeners = false; // cancel recurring events as well
        await eventSchedulerTasksService.removeByEvent(event, { listeners });

        if (event.metadata?.runAfterEvent) {
            relativeEventMetadataMap.delete(event.metadata.runAfterEvent._id);
        }

        logger.debug({
            msg: `Canceled the '${event.displayName}' event (${event.metadata?.taskType})`,
            event,
        });
    };

    const calculateNextRun = (event: Event): string | null => {
        if (!event.metadata) {
            return null;
        }

        const { cronExpression, interval } = event.metadata;

        if (cronExpression) {
            const cronParserOptions = {
                tz: timeZone,
                iterator: false as const,
            };

            const parsedCron = CronParser.parseExpression(cronExpression, cronParserOptions);

            return parsedCron.next().toISOString();
        } else if (interval) {
            return addSeconds(new Date(), interval).toISOString();
        }

        return null;
    };

    const scheduleEvent = async (event: Event) => {
        logger.debug({
            msg: `Scheduling the '${event.displayName}' event`,
            event,
        });

        if (!event.metadata) {
            logger.error({
                msg: `The scheduler encountered an invalid event, missing 'metadata'`,
                event,
            });

            return;
        }

        if (event.metadata.onMultipleInstances) {
            const tasks = await eventSchedulerTasksService.search({
                where: {
                    eventId: event._id,
                },
            });

            if (tasks.length) {
                switch (event.metadata.onMultipleInstances) {
                    case EventMetadataOnMultipleInstances.Skip:
                        return;

                    case EventMetadataOnMultipleInstances.Replace:
                        await eventSchedulerTasksService.removeByEvent(event);
                        break;

                    case EventMetadataOnMultipleInstances.Create:
                    default:
                        break;
                }
            }
        }

        const nextRunAt = calculateNextRun(event);

        if (!nextRunAt) {
            logger.error({
                msg: `The scheduler encountered an invalid event, failed to calculate the next run`,
                event,
            });

            return;
        }

        await eventSchedulerTasksService.create({
            event,
            nextRunAt,
            state: EventSchedulerTaskState.Queued,
        });

        logger.debug({
            msg: `Scheduled the '${event.displayName}' event (${event.metadata?.taskType}), next run at ${nextRunAt}`,
            event,
        });
    };

    const planEvent = async (event: Event) => {
        switch (event.metadata?.taskType) {
            case EventMetadataTaskType.StaticInterval:
            case EventMetadataTaskType.StaticCron:
                {
                    try {
                        await scheduleEvent(event);
                    } catch (e) {
                        logger.error({
                            msg: `Failed to schedule the '${event.displayName}' event`,
                            err: e,
                        });
                    }
                }
                break;

            case EventMetadataTaskType.RelativeInterval:
            case EventMetadataTaskType.RelativeCron:
                {
                    if (!event.metadata.runAfterEvent) {
                        logger.error({
                            msg: `The scheduler encountered an invalid event, missing 'runAfterEvent'`,
                            event,
                        });

                        return;
                    }

                    relativeEventMetadataMap.set(event.metadata.runAfterEvent._id, event);
                }

                break;

            default:
                logger.error({
                    msg: `The scheduler encountered an invalid event`,
                    event,
                });
        }
    };

    const setupEntitySubscribers = () => {
        const isScheduledEvent = (event: Event) =>
            event.triggerType === EventTriggerType.Scheduler && event.state === EventState.Active;

        const onCreatedEvent = async (event: Event) => {
            if (!isScheduledEvent(event)) {
                return;
            }

            await planEvent(event);
        };

        const onUpdatedEvent = async (event: Event, _oldEvent: Event, updatedColumns: ColumnMetadata[]) => {
            const updatedFields = _.uniq(updatedColumns.map((columnMetadata) => columnMetadata.propertyName));

            if (isScheduledEvent(event)) {
                /**
                 * changing the metadata as opposed to `state` and `triggerType`
                 * means that the event may have already been scheduled.
                 * it's necessary to cancel pending tasks and schedule the event again
                 */
                if (updatedFields.includes('metadata')) {
                    try {
                        await cancelEvent(event);
                    } catch (e) {
                        logger.error({
                            msg: `Failed to cancel the '${event.displayName}' event`,
                            event,
                            err: e,
                        });

                        return;
                    }
                }

                if (
                    updatedFields.includes('metadata') ||
                    updatedFields.includes('state') ||
                    updatedFields.includes('triggerType')
                ) {
                    await planEvent(event);
                }

                return;
            }

            try {
                await cancelEvent(event);
            } catch (e) {
                logger.error({
                    msg: `Failed to cancel the '${event.displayName}' event`,
                    event,
                    err: e,
                });
            }
        };

        createEventSubscriber(EntitySubscriberEvent.AfterInsert, onCreatedEvent);
        createEventSubscriber(EntitySubscriberEvent.AfterUpdate, onUpdatedEvent);

        const onCreatedEventInstance = async (eventInstance: EventInstance) => {
            const event = relativeEventMetadataMap.get(eventInstance.eventId);

            if (!event) {
                return;
            }

            try {
                await scheduleEvent(event);
            } catch (e) {
                logger.error({
                    msg: `Failed to schedule the '${event.displayName}' event`,
                    event,
                    err: e,
                });
            }
        };

        createEventInstanceSubscriber(EntitySubscriberEvent.AfterInsert, onCreatedEventInstance);

        const onRemovedEventSchedulerTask = async (eventSchedulerTask?: EventSchedulerTask) => {
            const event = eventSchedulerTask?.event;

            if (!event) {
                return;
            }

            if (event.metadata?.recurring) {
                if (
                    event.metadata?.taskType === EventMetadataTaskType.RelativeCron ||
                    event.metadata?.taskType === EventMetadataTaskType.RelativeInterval
                ) {
                    logger.debug({
                        msg: `Skipping the scheduling of the relative '${event.displayName}' event`,
                        event,
                    });
                    return;
                }

                try {
                    await scheduleEvent(event);
                } catch (e) {
                    logger.error({
                        msg: `Failed to schedule the '${event.displayName}' event`,
                        event,
                        err: e,
                    });
                }
            } else {
                try {
                    await eventsService.update(event, {
                        state: EventState.Completed,
                    });
                } catch (e) {
                    logger.error({
                        msg: `Failed to complete the '${event.displayName}' event`,
                        event,
                        err: e,
                    });
                }
            }
        };

        createEventSchedulerTaskSubscriber(EntitySubscriberEvent.AfterRemove, onRemovedEventSchedulerTask);
    };

    const processSkippedTasks = async () => {
        logger.trace(`Fetching skipped tasks from the database`);

        const now = new Date();

        let tasks: EventSchedulerTask[];

        try {
            // FETCH_TASKS_INTERVAL - 1 to prevent conflicts with task processor
            const nextRunAt = LessThanOrEqual(subMilliseconds(now, FETCH_TASKS_INTERVAL - 1)) as unknown as string;

            tasks = await eventSchedulerTasksService.search({
                where: {
                    nextRunAt,
                    state: EventSchedulerTaskState.Queued,
                },
            });
        } catch (e) {
            logger.error({
                msg: `Failed to fetch skipped tasks`,
                err: e,
            });

            return;
        }

        if (tasks.length) {
            logger.warn(`Found ${tasks.length} skipped event scheduler tasks`);

            for (const task of tasks) {
                const retryImmediatelyAfterBoot = Boolean(task.event.metadata?.retryImmediatelyAfterBoot);

                if (retryImmediatelyAfterBoot) {
                    logger.warn({
                        msg: `Setting the skipped task '${task._id}' for immediate execution`,
                        eventSchedulerTask: task,
                    });

                    try {
                        await eventSchedulerTasksService.update(task, {
                            nextRunAt: new Date().toISOString(),
                        });
                    } catch (e) {
                        logger.error({
                            msg: `Failed to update skipped task to run immediately after boot`,
                            err: e,
                            eventSchedulerTask: task,
                        });

                        return;
                    }
                } else {
                    logger.warn({
                        msg: `Setting the skipped task '${task._id}' for next execution according to schedule`,
                        eventSchedulerTask: task,
                    });

                    const nextRunAt = calculateNextRun(task.event);

                    if (!nextRunAt) {
                        logger.error({
                            msg: `The scheduler encountered an invalid event, failed to calculate the next run`,
                            eventSchedulerTask: task,
                        });

                        return;
                    }

                    try {
                        await eventSchedulerTasksService.update(task, {
                            nextRunAt,
                        });
                    } catch (e) {
                        logger.error({
                            msg: `Failed to update skipped task with next run at`,
                            err: e,
                            eventSchedulerTask: task,
                        });

                        return;
                    }
                }
            }
        }
    };

    /**
     * Hotfix for https://github.com/mmatloch/iot/issues/35
     * Theoretically, this could happen for any event if the service is restarted between the event trigger and the next task scheduling
     */
    const loadRelativeEvents = async () => {
        logger.trace(`Loading relative events from the database`);

        const schedulerEvents = await eventsService.search({
            where: {
                triggerType: EventTriggerType.Scheduler,
                state: EventState.Active,
            },
        });

        const relativeSchedulerEvents = schedulerEvents.filter((event) => {
            return (
                event.metadata?.taskType === EventMetadataTaskType.RelativeInterval ||
                event.metadata?.taskType === EventMetadataTaskType.RelativeCron
            );
        });

        logger.debug(`Found ${relativeSchedulerEvents.length} relative events to plan`);

        await Promise.all(relativeSchedulerEvents.map(planEvent));
    };

    return {
        initialize,
    };
};
