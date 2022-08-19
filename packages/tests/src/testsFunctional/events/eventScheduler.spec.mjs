import {
    generateEventPostPayload,
    generateEventSchedulerMetadata,
} from '../../dataGenerators/eventsDataGenerators.mjs';
import { createEventHelpers } from '../../helpers/helpers.mjs';

const H = createEventHelpers({
    path: 'events/scheduler/tasks',
});

const eventHelpers = createEventHelpers();

/**
 * @group events/eventScheduler
 */

describe('Event scheduler', () => {
    beforeAll(() => {
        H.authorizeHttpClient();
        eventHelpers.authorizeHttpClient();
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
                eventId: event._id,
            };

            // when
            const {
                body: { _hits: tasks },
            } = await H.search(query).expectHits(1);

            // then
            const [task] = tasks;
            const date = new Date();
            date.setHours(22, 0, 0, 0); // Europe/Warsaw time zone

            expect(task).toMatchObject({
                eventId: event._id,
                runAt: date.toISOString(),
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
                eventId: event._id,
            };

            await H.search(query).expectHits(1);

            const patchPayload = {
                triggerType: 'API',
            };

            // when
            await eventHelpers.patchById(event._id, patchPayload).expectSuccess();

            // then
            await H.search(query).expectHits(0);
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
                eventId: event._id,
            };

            await H.search(query).expectHits(1);

            const patchPayload = {
                state: 'COMPLETED',
            };

            // when
            await eventHelpers.patchById(event._id, patchPayload).expectSuccess();

            // then
            await H.search(query).expectHits(0);
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
                eventId: event._id,
            };

            await H.search(query).expectHits(1);

            // CANCEL
            const patchPayload = {
                state: 'COMPLETED',
            };

            await eventHelpers.patchById(event._id, patchPayload).expectSuccess();
            await H.search(query).expectHits(0);

            // RESCHEDULE
            patchPayload.state = 'ACTIVE';

            // when
            await eventHelpers.patchById(event._id, patchPayload).expectSuccess();

            // then
            await H.search(query).expectHits(1);
        });
    });
});
