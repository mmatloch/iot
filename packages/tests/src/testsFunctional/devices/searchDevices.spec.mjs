import { faker } from '@faker-js/faker';
import _ from 'lodash';

import {
    generateDeviceDisplayName,
    generateDeviceIeeeAddress,
    generateDevicePostPayload,
    generateDevicePowerSource,
    generateDeviceType,
} from '../../dataGenerators/devicesDataGenerators.mjs';
import { createDeviceHelpers } from '../../helpers/helpers.mjs';

const H = createDeviceHelpers();

const searchableFields = [
    {
        field: 'displayName',
        generateValue: generateDeviceDisplayName,
    },
    {
        field: 'model',
        generateValue: () => faker.random.alpha(15),
    },
    {
        field: 'manufacturer',
        generateValue: () => faker.random.alpha(15),
    },
    {
        field: 'vendor',
        generateValue: () => faker.random.alpha(15),
    },
    {
        field: 'description',
        generateValue: () => faker.random.alpha(15),
    },
    {
        field: 'ieeeAddress',
        generateValue: generateDeviceIeeeAddress,
    },
    {
        field: 'powerSource',
        generateValue: generateDevicePowerSource,
        isUnique: false,
    },
    {
        field: 'type',
        generateValue: generateDeviceType,
        isUnique: false,
    },
];

/**
 * @group devices/searchDevices
 */

describe('Devices searchDevices', () => {
    beforeAll(async () => {
        H.authorizeHttpClient();

        await Promise.all(_.times(10, () => H.post(generateDevicePostPayload()).expectSuccess()));
    });

    it('should return 10 devices when no filter is specified', async () => {
        // given
        const searchQuery = {};

        // when
        const { body } = await H.search(searchQuery).expectSuccess();

        // then
        expect(body._hits.length).toBe(10);
    });

    it.each(searchableFields)(
        `should find the device by '$field'`,
        async ({ field, generateValue, isUnique = true }) => {
            // given
            const newValue = generateValue();

            const devicePayload = generateDevicePostPayload();
            devicePayload[field] = newValue;

            await H.post(devicePayload).expectSuccess();

            // when
            const searchFn = H.search({
                filters: {
                    [field]: newValue,
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
