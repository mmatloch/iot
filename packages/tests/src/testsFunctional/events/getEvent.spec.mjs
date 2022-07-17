import { faker } from '@faker-js/faker';

import { generateEventPostPayload } from '../../dataGenerators/eventsDataGenerators.mjs';
import { createEventHelpers } from '../../helpers/helpers.mjs';

const H = createEventHelpers();

/**
 * @group events/getEvent
 */

describe('Event getEvent', () => {
    beforeAll(() => {
        H.authorizeHttpClient();
    });

    it('should get an event', async () => {
        // given
        const payload = generateEventPostPayload();
        const { body: createdEvent } = await H.post(payload).expectSuccess();

        // when
        const { body: event } = await H.getById(createdEvent._id).expectSuccess();

        // then
        expect(event).toStrictEqual(createdEvent);
    });

    it('should return an error if the event does not exist', async () => {
        await H.getById(faker.datatype.number({ min: 1000000 })).expectNotFound({
            message: 'Event does not exist',
            errorCode: 'SRV-5',
        });
    });
});
