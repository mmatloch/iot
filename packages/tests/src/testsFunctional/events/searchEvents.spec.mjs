import _ from 'lodash';

import { generateDeviceIeeeAddress } from '../../dataGenerators/devicesDataGenerators.mjs';
import {
    generateEventDisplayName,
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
        field: 'triggerType',
        generateValue: generateEventTriggerType,
        isUnique: false,
    },
    {
        field: 'triggerFilters',
        generateValue: () => ({
            ieeeAddress: generateDeviceIeeeAddress(),
        }),
        mapValue: JSON.stringify,
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

    it('should return 10 events when no filter is specified', async () => {
        // given
        const searchQuery = {};

        // when
        const { body } = await H.search(searchQuery).expectSuccess();

        // then
        expect(body._hits.length).toBe(10);
    });

    it.each(searchableFields)(
        `should find the event by '$field'`,
        async ({ field, generateValue, mapValue, isUnique = true }) => {
            // given
            const newValue = generateValue();

            const eventPayload = generateEventPostPayload();
            eventPayload[field] = newValue;

            await H.post(eventPayload).expectSuccess();

            // when
            const searchFn = H.search({
                filters: {
                    [field]: mapValue ? mapValue(newValue) : newValue,
                },
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
