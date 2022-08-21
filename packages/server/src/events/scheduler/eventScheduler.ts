import CronParser from 'cron-parser';
import { addSeconds } from 'date-fns';
import _ from 'lodash';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';

import { getConfig } from '../../config';
import type { Event } from '../../entities/eventEntity';
import { createEventSubscriber } from '../../entities/eventEntitySubscriber';
import type { EventInstance } from '../../entities/eventInstanceEntity';
import { createEventInstanceSubscriber } from '../../entities/eventInstanceEntitySubscriber';
import { EventSchedulerTask, EventSchedulerTaskState } from '../../entities/eventSchedulerTaskEntity';
import { createEventSchedulerTaskSubscriber } from '../../entities/eventSchedulerTaskEntitySubscriber';
import { EntitySubscriberEvent } from '../../entities/subscriberDefinitions';
import { getLogger } from '../../logger';
import { createEventSchedulerTasksService } from '../../services/eventSchedulerTasksService';
import {
    EventMetadataOnMultipleInstances,
    EventMetadataTaskType,
    EventState,
    EventTriggerType,
} from '../eventDefinitions';

const logger = getLogger();
const config = getConfig();

const timeZone = config.app.timeZone;

type RelativeEventMetadataMap = Map<number, Event>;

export const createEventScheduler = () => {
    const eventSchedulerTasksService = createEventSchedulerTasksService();

    const relativeEventMetadataMap: RelativeEventMetadataMap = new Map();

    const initialize = () => {
        logger.debug('Initializing event scheduler');

        setupEntitySubscribers();
    };

    const cancelEvent = async (event: Event) => {
        logger.debug({
            msg: `Canceling the '${event.displayName}' event`,
            event,
        });

        const listeners = false; // cancel recurring events as well
        await eventSchedulerTasksService.removeByEvent(event, { listeners });

        if (event.metadata?.runAfterEvent) {
            relativeEventMetadataMap.delete(event.metadata.runAfterEvent);
        }

        logger.debug({
            msg: `Canceled the '${event.displayName}' event (${event.metadata?.taskType})`,
            event,
        });
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
            const { _hits: tasks } = await eventSchedulerTasksService.search({
                eventId: event._id,
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

        const { cronExpression, interval } = event.metadata;

        let nextRunAt: string;
        if (cronExpression) {
            const cronParserOptions = {
                tz: timeZone,
                iterator: false as const,
            };

            const parsedCron = CronParser.parseExpression(cronExpression, cronParserOptions);

            nextRunAt = parsedCron.next().toISOString();
        } else if (interval) {
            nextRunAt = addSeconds(new Date(), interval).toISOString();
        } else {
            logger.error({
                msg: `The scheduler encountered an invalid event, missing 'cronExpression' and 'interval'`,
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

                    relativeEventMetadataMap.set(event.metadata.runAfterEvent, event);
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

        const onUpdatedEvent = async (event: Event, updatedColumns: ColumnMetadata[]) => {
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
                try {
                    await scheduleEvent(event);
                } catch (e) {
                    logger.error({
                        msg: `Failed to schedule the '${event.displayName}' event`,
                        event,
                        err: e,
                    });
                }
            }
        };

        createEventSchedulerTaskSubscriber(EntitySubscriberEvent.AfterRemove, onRemovedEventSchedulerTask);
    };

    return {
        initialize,
    };
};
