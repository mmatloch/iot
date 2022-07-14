import { faker } from '@faker-js/faker';
import _ from 'lodash';

import { generateDeviceIeeeAddress } from '../../dataGenerators/devicesDataGenerators.mjs';
import {
    generateEventDisplayName,
    generateEventName,
    generateEventPostPayload,
    generateEventTriggerType,
} from '../../dataGenerators/eventsDataGenerators.mjs';
import { createEventHelpers } from '../../helpers/helpers.mjs';

const H = createEventHelpers();

const searchableFields = [
    {
        field: 'displayName',
        generateValue: generateEventDisplayName,
    },
    {
        field: 'name',
        generateValue: generateEventName,
    },
    {
        field: 'triggerType',
        generateValue: generateEventTriggerType,
        isUnique: false,
    },
    {
        field: 'triggerFilters',
        generateValue: () => ({
            ieeeAddress: generateDeviceIeeeAddress(),
        }),
    },
];

/**
 * @group events/searchEvents
 */

describe('Events searchEvents', () => {
    beforeAll(async () => {
        H.authorizeHttpClient();

        await Promise.all(_.times(5, () => H.post(generateEventPostPayload()).expectSuccess()));
    });

    it('should return all events when no filter is specified', async () => {
        // given
        const searchQuery = {};

        // when
        const { body } = await H.search(searchQuery).expectSuccess();

        // then
        expect(body._hits.length).toBeGreaterThanOrEqual(1);
    });

    it.each(searchableFields)(
        `should find the event by '$field'`,
        async ({ field, generateValue, isUnique = true }) => {
            // given
            const newValue = generateValue();

            const eventPayload = generateEventPostPayload();
            eventPayload[field] = newValue;

            await H.post(eventPayload).expectSuccess();

            // when
            const searchFn = H.search({
                [field]: newValue,
            });

            let _hits;

            if (isUnique) {
                ({
                    body: { _hits },
                } = await searchFn.expectHits(1));
            } else {
                ({
                    body: { _hits },
                } = await searchFn.expectSuccess());
            }

            _hits.forEach((hit) => {
                expect(hit).toHaveProperty(field, newValue);
            });
        },
    );
});
