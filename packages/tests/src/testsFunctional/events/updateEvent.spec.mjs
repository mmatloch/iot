import { faker } from '@faker-js/faker';

import { generateDeviceIeeeAddress } from '../../dataGenerators/devicesDataGenerators.mjs';
import {
    generateEventDisplayName,
    generateEventPostPayload,
    generateEventSchedulerMetadata,
} from '../../dataGenerators/eventsDataGenerators.mjs';
import { createEventHelpers } from '../../helpers/helpers.mjs';

const updatableFields = [
    {
        field: 'displayName',
        generateValue: generateEventDisplayName,
    },
    {
        field: 'triggerType',
        generateValue: () => 'OUTGOING_DEVICE_DATA',
        initialValue: 'INCOMING_DEVICE_DATA',
    },
    {
        field: 'triggerFilters',
        generateValue: () => ({
            ieeeAddress: generateDeviceIeeeAddress(),
        }),
    },
    {
        field: 'conditionDefinition',
        generateValue: () => `return ${faker.random.alphaNumeric(15)}`,
    },
    {
        field: 'actionDefinition',
        generateValue: () => `return ${faker.random.alphaNumeric(15)}`,
    },
    {
        field: 'metadata',
        generateValue: generateEventSchedulerMetadata,
    },
];

const uniqueFields = [
    {
        field: 'displayName',
        generateValue: generateEventDisplayName,
    },
];

/**
 * @group events/updateEvent
 */

describe('Events updateEvent', () => {
    describe('as ADMIN', () => {
        const H = createEventHelpers();

        beforeAll(() => {
            H.authorizeHttpClient();
        });

        it.each(updatableFields)(`should update '$field'`, async ({ field, generateValue, initialValue }) => {
            // given
            const postPayload = generateEventPostPayload();
            if (initialValue) {
                postPayload[field] = initialValue;
            }

            const { body: createdEvent } = await H.post(postPayload).expectSuccess();

            const newValue = generateValue();

            const payload = {
                [field]: newValue,
            };

            // when
            const { body: updatedEvent } = await H.patchById(createdEvent._id, payload).expectSuccess();

            // then
            const { body: eventAfterUpdate } = await H.getById(createdEvent._id).expectSuccess();

            expect(eventAfterUpdate).toStrictEqual(updatedEvent);

            expect(updatedEvent[field]).toEqual(newValue);
            expect(createdEvent[field]).not.toEqual(newValue);

            // check technical fields
            expect(updatedEvent._version).toBe(createdEvent._version + 1);
            expect(new Date(updatedEvent._updatedAt)).toBeAfter(new Date(createdEvent._updatedAt));
            expect(updatedEvent._createdAt).toBe(createdEvent._createdAt);
        });

        it('should return an error if the event does not exist', async () => {
            // given
            const payload = {
                displayName: faker.random.alphaNumeric(15),
            };

            // when & then
            await H.patchById(faker.datatype.number({ min: 1000000 }), payload).expectNotFound({
                message: 'Event does not exist',
                errorCode: 'SRV-5',
            });
        });

        it.each(uniqueFields)(
            `should return an error if a event with this '$field' already exists`,
            async ({ field, generateValue }) => {
                // given

                const firstPayload = generateEventPostPayload();
                const secondPayload = generateEventPostPayload();

                const newValue = generateValue();
                firstPayload[field] = newValue;

                await H.post(firstPayload).expectSuccess();
                const { body: secondEvent } = await H.post(secondPayload).expectSuccess();

                const payload = {
                    [field]: newValue,
                };

                // when & then
                await H.patchById(secondEvent._id, payload).expectConflict({
                    message: `Event already exists`,
                    detail: `Key ("${field}")=(${newValue}) already exists.`,
                    errorCode: 'SRV-6',
                });
            },
        );

        it('should return an error if the event does not contain metadata and has triggerType `SCHEDULER`', async () => {
            // given
            const payload = generateEventPostPayload();
            const { body: event } = await H.post(payload).expectSuccess();

            const patchPayload = {
                triggerType: 'SCHEDULER',
                metadata: null,
            };

            // when & then
            await H.patchById(event._id, patchPayload).expectUnprocessableEntity({
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
            const { body: event } = await H.post(payload).expectSuccess();

            const patchPayload = {
                triggerType: 'SCHEDULER',
                metadata: metadata,
            };

            // when & then
            await H.patchById(event._id, patchPayload).expectUnprocessableEntity({
                errorCode: 'SRV-12',
                message: 'Invalid event metadata',
                detail: 'Invalid cron expression',
            });
        });
    });

    describe('as USER', () => {
        const H = createEventHelpers();

        beforeEach(async () => {
            H.authorizeHttpClient({
                role: 'USER',
            });
        });

        it('should return an error when trying to update the event', async () => {
            // given
            const payload = {
                displayName: faker.random.alpha(15),
            };

            // when & then
            await H.patchById(faker.datatype.number({ min: 1000000 }), payload).expectForbidden({
                errorCode: 'SRV-3',
            });
        });
    });
});
