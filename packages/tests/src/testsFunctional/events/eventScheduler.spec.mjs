import {
    generateEventPostPayload,
    generateEventSchedulerMetadata,
    generateEventTriggerPayload,
} from '../../dataGenerators/eventsDataGenerators.mjs';
import {
    createEventHelpers,
    createEventSchedulerTasksHelpers,
    createEventTriggerHelpers,
} from '../../helpers/helpers.mjs';

const H = createEventSchedulerTasksHelpers();
const eventHelpers = createEventHelpers();
const eventTriggerHelpers = createEventTriggerHelpers();

/**
 * @group events/eventScheduler
 */

describe('Event scheduler', () => {
    beforeAll(() => {
        H.authorizeHttpClient();
        eventHelpers.authorizeHttpClient();
        eventTriggerHelpers.authorizeHttpClient();
    });

    describe('taskType STATIC_CRON', () => {
        it('should schedule the created event', async () => {
            // given
            const payload = generateEventPostPayload();
            payload.triggerType = 'SCHEDULER';

            const metadata = generateEventSchedulerMetadata();
            metadata.taskType = 'STATIC_CRON';
            payload.metadata = metadata;

            const { body: event } = await eventHelpers.post(payload).expectSuccess();

            const query = {
                filters: {
                    eventId: event._id,
                },
            };

            // when
            const {
                body: { _hits: tasks },
            } = await H.repeatSearch(query).expectHits(1);

            // then
            const [task] = tasks;

            expect(task).toMatchObject({
                event,
            });
        });

        it('should cancel the scheduled event when the `triggerType` has changed', async () => {
            // given
            const payload = generateEventPostPayload();
            payload.triggerType = 'SCHEDULER';

            const metadata = generateEventSchedulerMetadata();
            metadata.taskType = 'STATIC_CRON';
            payload.metadata = metadata;

            const { body: event } = await eventHelpers.post(payload).expectSuccess();

            const query = {
                filters: {
                    eventId: event._id,
                },
            };

            await H.repeatSearch(query).expectHits(1);

            const patchPayload = {
                triggerType: 'API',
            };

            // when
            await eventHelpers.patchById(event._id, patchPayload).expectSuccess();

            // then
            await H.repeatSearch(query).expectHits(0);
        });

        it('should cancel the scheduled event when the `state` has changed', async () => {
            // given
            const payload = generateEventPostPayload();
            payload.triggerType = 'SCHEDULER';

            const metadata = generateEventSchedulerMetadata();
            metadata.taskType = 'STATIC_CRON';
            payload.metadata = metadata;

            const { body: event } = await eventHelpers.post(payload).expectSuccess();

            const query = {
                filters: {
                    eventId: event._id,
                },
            };

            await H.repeatSearch(query).expectHits(1);

            const patchPayload = {
                state: 'COMPLETED',
            };

            // when
            await eventHelpers.patchById(event._id, patchPayload).expectSuccess();

            // then
            await H.repeatSearch(query).expectHits(0);
        });

        it('should reschedule the event when the `state` changed to `ACTIVE` again', async () => {
            // given
            const payload = generateEventPostPayload();
            payload.triggerType = 'SCHEDULER';

            const metadata = generateEventSchedulerMetadata();
            metadata.taskType = 'STATIC_CRON';
            payload.metadata = metadata;

            // SCHEDULE
            const { body: event } = await eventHelpers.post(payload).expectSuccess();

            const query = {
                filters: {
                    eventId: event._id,
                },
            };

            await H.repeatSearch(query).expectHits(1);

            // CANCEL
            const patchPayload = {
                state: 'COMPLETED',
            };

            await eventHelpers.patchById(event._id, patchPayload).expectSuccess();
            await H.repeatSearch(query).expectHits(0);

            // RESCHEDULE
            patchPayload.state = 'ACTIVE';

            // when
            await eventHelpers.patchById(event._id, patchPayload).expectSuccess();

            // then
            await H.repeatSearch(query).expectHits(1);
        });
    });

    describe('taskType RELATIVE_CRON', () => {
        it('should schedule an event after another event is triggered', async () => {
            // given
            // create an event to trigger
            const { body: event } = await eventHelpers.post(generateEventPostPayload()).expectSuccess();

            // create an event to schedule
            const payload = generateEventPostPayload();
            payload.triggerType = 'SCHEDULER';

            const metadata = generateEventSchedulerMetadata();
            metadata.taskType = 'RELATIVE_CRON';
            metadata.runAfterEvent = {
                _id: event._id,
                displayName: event.displayName,
            };
            payload.metadata = metadata;

            const { body: scheduledEvent } = await eventHelpers.post(payload).expectSuccess();

            const query = {
                filters: {
                    eventId: scheduledEvent._id,
                },
            };

            // the event was not scheduled immediately
            await H.repeatSearch(query).expectHits(0);

            // trigger
            const triggerPayload = generateEventTriggerPayload();
            triggerPayload.filters.triggerType = event.triggerType;
            triggerPayload.filters.triggerFilters = event.triggerFilters;

            await eventTriggerHelpers.post(triggerPayload).expectSuccess();

            // when
            const {
                body: { _hits: tasks },
            } = await H.repeatSearch(query).expectHits(1);

            // then
            const [task] = tasks;

            expect(task).toMatchObject({
                event: scheduledEvent,
            });
        });
    });

    describe('taskType STATIC_INTERVAL', () => {
        it('should schedule the created event', async () => {
            // given
            const payload = generateEventPostPayload();
            payload.triggerType = 'SCHEDULER';

            const metadata = generateEventSchedulerMetadata();
            metadata.taskType = 'STATIC_INTERVAL';
            metadata.interval = 3600;
            payload.metadata = metadata;

            const { body: event } = await eventHelpers.post(payload).expectSuccess();

            const query = {
                filters: {
                    eventId: event._id,
                },
            };

            // when
            const {
                body: { _hits: tasks },
            } = await H.repeatSearch(query).expectHits(1);

            // then
            const [task] = tasks;

            expect(task).toMatchObject({
                event,
            });
        });
    });

    describe('taskType RELATIVE_INTERVAL', () => {
        it('should schedule an event after another event is triggered', async () => {
            // given
            // create an event to trigger
            const { body: event } = await eventHelpers.post(generateEventPostPayload()).expectSuccess();

            // create an event to schedule
            const payload = generateEventPostPayload();
            payload.triggerType = 'SCHEDULER';

            const metadata = generateEventSchedulerMetadata();
            metadata.taskType = 'RELATIVE_INTERVAL';
            metadata.runAfterEvent = {
                _id: event._id,
                displayName: event.displayName,
            };
            metadata.interval = 3600;
            payload.metadata = metadata;

            const { body: scheduledEvent } = await eventHelpers.post(payload).expectSuccess();

            const query = {
                filters: {
                    eventId: scheduledEvent._id,
                },
            };

            // the event was not scheduled immediately
            await H.repeatSearch(query).expectHits(0);

            // trigger
            const triggerPayload = generateEventTriggerPayload();
            triggerPayload.filters.triggerType = event.triggerType;
            triggerPayload.filters.triggerFilters = event.triggerFilters;

            await eventTriggerHelpers.post(triggerPayload).expectSuccess();

            // when
            const {
                body: { _hits: tasks },
            } = await H.repeatSearch(query).expectHits(1);

            // then
            const [task] = tasks;

            expect(task).toMatchObject({
                event: scheduledEvent,
            });
        });
    });
});
