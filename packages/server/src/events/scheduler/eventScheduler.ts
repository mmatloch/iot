import CronParser from 'cron-parser';
import _ from 'lodash';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';

import type { Event } from '../../entities/eventEntity';
import { createEventSubscriber } from '../../entities/eventEntitySubscriber';
import { EntitySubscriberEvent } from '../../entities/subscriberDefinitions';
import { getLogger } from '../../logger';
import { createEventsService } from '../../services/eventsService';
import { EventState, EventTriggerType } from '../eventDefinitions';
import { eventTriggerInNewContext } from '../eventTriggerInNewContext';
import { getEventSchedulerTaskManager } from './eventSchedulerTaskManager';

const logger = getLogger();
const timeZone = 'Europe/Warsaw';

const getTimeoutToNextFullMinute = () => {
    const now = new Date();
    const maxSeconds = 59;
    const maxMiliseconds = 999;

    const timeout = 1000 * (maxSeconds - now.getSeconds()) + (maxMiliseconds - now.getMilliseconds());

    return timeout;
};

export const createEventScheduler = () => {
    const taskManager = getEventSchedulerTaskManager();
    const eventsService = createEventsService();

    const cancelEvent = (event: Event) => {
        logger.debug(`Cancelling the '${event.displayName}' event`);

        taskManager.removeByEventId(event._id);
    };

    const scheduleEvent = (event: Event) => {
        const cronParserOptions = {
            tz: timeZone,
            iterator: false as const,
        };

        if (event.metadata?.taskType === 'STATIC_CRON') {
            const parsedCron = CronParser.parseExpression(event.metadata.cronExpression, cronParserOptions);

            const runAt = parsedCron.next().toDate();

            logger.debug({
                msg: `Scheduled the '${event.displayName}' event (static CRON), next run at ${runAt.toISOString()}`,
                event,
            });

            taskManager.add(
                {
                    eventId: event._id,
                    runAt,
                },
                event.metadata.onMultipleInstances,
            );
        }
    };

    const initialize = async () => {
        const { _hits: events } = await eventsService.search({
            triggerType: EventTriggerType.Scheduler,
            state: EventState.Active,
        });

        events.forEach(scheduleEvent);

        setupEntitySubscribers();
        startScheduler();
    };

    const setupEntitySubscribers = () => {
        const isScheduledEvent = (event: Event) =>
            event.triggerType === EventTriggerType.Scheduler && event.state === EventState.Active;

        const onCreatedEvent = (event: Event) => {
            if (!isScheduledEvent(event)) {
                return;
            }

            scheduleEvent(event);
        };

        const onUpdatedEvent = (event: Event, updatedColumns: ColumnMetadata[]) => {
            const updatedFields = _.uniq(updatedColumns.map((columnMetadata) => columnMetadata.propertyName));

            if (isScheduledEvent(event)) {
                /**
                 * changing the metadata as opposed to `state` and `triggerType`
                 * means that the event may have already been scheduled.
                 * it's necessary to cancel pending tasks and schedule the event again
                 */
                if (updatedFields.includes('metadata')) {
                    cancelEvent(event);
                }

                if (
                    updatedFields.includes('metadata') ||
                    updatedFields.includes('state') ||
                    updatedFields.includes('triggerType')
                ) {
                    scheduleEvent(event);
                }

                return;
            }

            cancelEvent(event);
        };

        createEventSubscriber(EntitySubscriberEvent.AfterInsert, onCreatedEvent);
        createEventSubscriber(EntitySubscriberEvent.AfterUpdate, onUpdatedEvent);
    };

    const startScheduler = () => {
        logger.info('Starting event scheduler');

        retryImmediatelyAfterBoot();

        const timeout = getTimeoutToNextFullMinute();
        logger.debug(`Tasks processing will start in ${timeout}ms`);
        setTimeout(() => processTasks(), timeout);
    };

    const retryImmediatelyAfterBoot = () => {};

    const processTasks = async () => {
        logger.debug(`Processing tasks, total number of scheduled tasks: ${taskManager.getTaskCount()}`);

        const now = new Date();

        const tasks = taskManager.searchBeforeDate(now);
        logger.debug(`Found ${tasks.length} tasks to process`);

        let events;

        try {
            events = await Promise.all(tasks.map((task) => eventsService.findByIdOrFail(task.eventId)));
        } catch (e) {
            const timeout = getTimeoutToNextFullMinute();
            logger.error(
                `There was an error while searching for events, the next task processing will start in ${timeout}ms`,
            );
            setTimeout(() => processTasks(), timeout);
            return;
        }

        await Promise.allSettled(
            events.map(async (event, index) => {
                const task = tasks[index];
                taskManager.remove(task);

                if (event.metadata?.recurring) {
                    scheduleEvent(event);
                } else {
                    await eventsService.update(event, {
                        state: EventState.Completed,
                    });
                }

                const context = {};
                return eventTriggerInNewContext(event, context);
            }),
        );

        const timeout = getTimeoutToNextFullMinute();
        logger.debug(`The next task processing will start in ${timeout}ms`);
        setTimeout(() => processTasks(), timeout);
    };

    return {
        initialize,
    };
};
