import { faker } from '@faker-js/faker';
import _ from 'lodash';

import {
    generateDeviceDisplayName,
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
        generateValue: faker.vehicle.model,
    },
    {
        field: 'vendor',
        generateValue: faker.company.companyName,
    },
    {
        field: 'description',
        generateValue: faker.commerce.productDescription,
    },
    {
        field: 'ieeeAddress',
        generateValue: faker.vehicle.vin,
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

        await Promise.all(_.times(5, () => H.post(generateDevicePostPayload()).expectSuccess()));
    });

    it('should return all devices when no filter is specified', async () => {
        // given
        const searchQuery = {};

        // when
        const { body } = await H.search(searchQuery).expectSuccess();

        // then
        expect(body._hits.length).toBeGreaterThanOrEqual(1);
    });

    it.each(searchableFields)(`should find the device by '$field'`, async ({ field, generateValue, isUnique }) => {
        // given
        const newValue = generateValue();

        const devicePayload = generateDevicePostPayload();
        devicePayload[field] = newValue;

        await H.post(devicePayload).expectSuccess();

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
    });
});
