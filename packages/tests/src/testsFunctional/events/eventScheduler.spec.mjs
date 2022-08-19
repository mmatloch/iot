import {
    generateEventPostPayload,
    generateEventSchedulerMetadata,
} from '../../dataGenerators/eventsDataGenerators.mjs';
import { createEventHelpers } from '../../helpers/helpers.mjs';

const H = createEventHelpers();

/**
 * @group events/eventScheduler
 */

describe('Event scheduler', () => {
    describe('as ADMIN', () => {
        beforeAll(() => {
            H.authorizeHttpClient();
        });

        it('should create a event', async () => {
            // given
            const payload = generateEventPostPayload();
            payload.triggerType = 'SCHEDULER';
            // payload.metadata = generateEventSchedulerMetadata();
            payload.metadata = {
                type: 'SCHEDULER',
                retryImmediatelyAfterBoot: false,
                recurring: false,
                cronExpression: '0 17 * * *',
                taskType: 'STATIC_CRON',
                onMultipleInstances: 'CREATE',
            };

            // when
            const { body: event } = await H.post(payload).expectSuccess();

            // then
            console.log(event);
        });
    });
});
