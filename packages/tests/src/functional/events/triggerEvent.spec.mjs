import { generateEventPostPayload, generateEventTriggerPayload } from '../../dataGenerators/eventsDataGenerators.mjs';
import { createEventHelpers } from '../../helpers/helpers.mjs';

const H = createEventHelpers({
    path: 'events/trigger',
});

const eventHelpers = createEventHelpers();

/**
 * @group events/triggerEvent
 */

describe('Events triggerEvent', () => {
    describe('as USER', () => {
        beforeAll(() => {
            H.authorizeHttpClient({
                role: 'USER',
            });
        });

        it('should receive an error when trying to trigger a event', async () => {
            // given
            const payload = generateEventTriggerPayload();

            // when & then
            await H.post(payload).expectForbidden({
                errorCode: 'SRV-3',
            });
        });
    });

    describe('as ADMIN', () => {
        beforeAll(() => {
            H.authorizeHttpClient();
            eventHelpers.authorizeHttpClient();
        });

        it('should trigger a event', async () => {
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
        });

        it('should return an error when there is no event matching the filters', async () => {
            // given
            const eventPayload = generateEventPostPayload();
            await H.post(eventPayload).expectSuccess();

            const payload = generateEventTriggerPayload();

            // when & then
            await H.post(payload).expectNotFound({
                errorCode: 'SRV-6',
                message: 'Event does not exists',
            });
        });
    });
});
