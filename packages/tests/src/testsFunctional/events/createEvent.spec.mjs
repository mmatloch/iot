import {
    generateEventPostPayload,
    generateEventSchedulerMetadata,
} from '../../dataGenerators/eventsDataGenerators.mjs';
import { createEventHelpers } from '../../helpers/helpers.mjs';

const H = createEventHelpers();

/**
 * @group events/createEvent
 */

describe('Events createEvent', () => {
    describe('as ADMIN', () => {
        beforeAll(() => {
            H.authorizeHttpClient();
        });

        it('should create a event', async () => {
            // given
            const payload = generateEventPostPayload();

            // when
            const { body: event } = await H.post(payload).expectSuccess();

            // then
            expect(event).toMatchObject(payload);
            expect(event).toHaveProperty('_id');
            expect(event).toHaveProperty('_version', 1);
            expect(event).toHaveProperty('_createdAt');
            expect(event).toHaveProperty('_updatedAt');
            expect(event).toHaveProperty('state', 'ACTIVE');
            expect(event).toHaveProperty('metadata', null);
        });

        it('should return an error if a event with this `displayName` already exists', async () => {
            // given
            const { body: firstEvent } = await H.post(generateEventPostPayload()).expectSuccess();

            const payload = generateEventPostPayload();
            payload.displayName = firstEvent.displayName;

            // when & then
            await H.post(payload).expectConflict({
                errorCode: 'SRV-6',
                message: 'Event already exists',
                detail: `Key ("displayName")=(${payload.displayName}) already exists.`,
            });
        });

        it('should return an error if the event does not contain metadata and has triggerType `SCHEDULER`', async () => {
            // given
            const payload = generateEventPostPayload();
            payload.triggerType = 'SCHEDULER';
            payload.metadata = null;

            // when & then
            await H.post(payload).expectUnprocessableEntity({
                errorCode: 'SRV-12',
                message: 'Invalid event metadata',
                detail: `Event with triggerType 'SCHEDULER' requires metadata with type 'SCHEDULER'`,
            });
        });

        it('should return an error if cronExpression is invalid', async () => {
            // given
            const metadata = generateEventSchedulerMetadata();
            metadata.cronExpression = '0 0 123 * *';

            const payload = generateEventPostPayload();
            payload.triggerType = 'SCHEDULER';
            payload.metadata = metadata;

            // when & then
            await H.post(payload).expectUnprocessableEntity({
                errorCode: 'SRV-12',
                message: 'Invalid event metadata',
                detail: 'Invalid cron expression',
            });
        });
    });

    describe('as USER', () => {
        beforeAll(() => {
            H.authorizeHttpClient({
                role: 'USER',
            });
        });

        it('should receive an error when trying to create a event', async () => {
            // given
            const payload = generateEventPostPayload();

            // when & then
            await H.post(payload).expectForbidden({
                errorCode: 'SRV-3',
            });
        });
    });
});
