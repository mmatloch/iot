import { faker } from '@faker-js/faker';
import _ from 'lodash';

import { generateZigbeeDevice } from '../../dataGenerators/zigbeeDataGenerators.mjs';
import { createDeviceHelpers, createZigbeeBridgeDevicesHelpers } from '../../helpers/helpers.mjs';
import { createConfigurationUtils } from '../../utils/configurationUtils.mjs';
import { connectToBroker, disconnectFromBroker } from '../../utils/mqttClient.mjs';

const H = createZigbeeBridgeDevicesHelpers();
const deviceHelpers = createDeviceHelpers();
const configurationUtils = createConfigurationUtils();

const findDevice = async (query) => {
    const {
        body: { _hits },
    } = await deviceHelpers.repeatSearch(query).expectHits(1);

    return _hits[0];
};

/**
 * @group zigbeeBridge/updateDevice
 */

describe('Zigbee bridge updateDevice', () => {
    beforeAll(async () => {
        deviceHelpers.authorizeHttpClient();
        await configurationUtils.ensureZigbeeBridge();
        await connectToBroker();
    });

    afterAll(async () => {
        await disconnectFromBroker();
    });

    it(`should update the device's common fields`, async () => {
        // given
        const zigbeeDevice = generateZigbeeDevice.temperatureAndHumiditySensor();
        await H.publish([zigbeeDevice]);

        const query = {
            filters: {
                ieeeAddress: zigbeeDevice.ieee_address,
            },
        };

        const deviceBeforeUpdate = await findDevice(query);

        const updatedZigbeeDevice = {
            type: 'Router',
            power_source: 'DC Source',
            definition: {
                model: faker.random.alphaNumeric(20),
                vendor: faker.random.alphaNumeric(20),
            },
            manufacturer: faker.random.alphaNumeric(20),
        };

        // when
        await H.publish([_.merge({}, zigbeeDevice, updatedZigbeeDevice)]);

        // then
        const deviceAfterUpdate = await findDevice({
            filters: {
                ...query.filters,
                manufacturer: updatedZigbeeDevice.manufacturer, // unique
            },
        });

        expect(deviceBeforeUpdate._id).toBe(deviceAfterUpdate._id);
        expect(deviceBeforeUpdate._version + 1).toBe(deviceAfterUpdate._version);
        expect(deviceAfterUpdate).toMatchObject({
            type: 'ROUTER',
            powerSource: 'DC',
            model: updatedZigbeeDevice.definition.model,
            vendor: updatedZigbeeDevice.definition.vendor,
            manufacturer: updatedZigbeeDevice.manufacturer,
        });
    });

    it('should activate the device deactivated by the bridge', async () => {
        // given
        const zigbeeDevice = generateZigbeeDevice.temperatureAndHumiditySensor();
        zigbeeDevice.interview_completed = true;
        zigbeeDevice.interviewing = false;

        const query = {
            filters: {
                ieeeAddress: zigbeeDevice.ieee_address,
            },
        };

        // create
        await H.publish([zigbeeDevice]);
        await findDevice({
            filters: {
                ...query.filters,
                state: 'ACTIVE',
            },
        });

        // deactivate
        await H.publish([]);
        const inactiveDevice = await findDevice({
            filters: {
                ...query.filters,
                state: 'INACTIVE',
            },
        });

        expect(inactiveDevice).toHaveProperty('deactivatedBy', {
            type: 'BRIDGE',
            name: 'Zigbee',
        });

        // when
        await H.publish([zigbeeDevice]);

        // then
        const activeDevice = await findDevice({
            filters: {
                ...query.filters,
                state: 'ACTIVE',
            },
        });

        expect(activeDevice).toHaveProperty('deactivatedBy', null);
    });

    it('should update the state to "INTERVIEWING" if the device has entered the interviewing phase', async () => {
        // given
        const zigbeeDevice = generateZigbeeDevice.temperatureAndHumiditySensor();
        zigbeeDevice.interview_completed = false;
        zigbeeDevice.interviewing = false;

        const query = {
            filters: {
                ieeeAddress: zigbeeDevice.ieee_address,
            },
        };

        // create
        await H.publish([zigbeeDevice]);
        await findDevice({
            filters: {
                ...query.filters,
                state: 'NEW',
            },
        });

        // start interview
        zigbeeDevice.interview_completed = false;
        zigbeeDevice.interviewing = true;

        // when
        await H.publish([zigbeeDevice]);

        // then
        await findDevice({
            filters: {
                ...query.filters,
                state: 'INTERVIEWING',
            },
        });
    });

    it('should update the state to "ACTIVE" if the device has finished the interviewing phase', async () => {
        // given
        const zigbeeDevice = generateZigbeeDevice.temperatureAndHumiditySensor();
        zigbeeDevice.interview_completed = false;
        zigbeeDevice.interviewing = false;

        const query = {
            filters: {
                ieeeAddress: zigbeeDevice.ieee_address,
            },
        };

        // create
        await H.publish([zigbeeDevice]);
        await findDevice({
            filters: {
                ...query.filters,
                state: 'NEW',
            },
        });

        // finish interview
        zigbeeDevice.interview_completed = true;
        zigbeeDevice.interviewing = false;

        // when
        await H.publish([zigbeeDevice]);

        // then
        await findDevice({
            filters: {
                ...query.filters,
                state: 'ACTIVE',
            },
        });
    });

    it('should update the description when the device switches from "unknown" type', async () => {
        // given
        const unknownZigbeeDevice = generateZigbeeDevice.unknown();

        const query = {
            filters: {
                ieeeAddress: unknownZigbeeDevice.ieee_address,
            },
        };

        await H.publish([unknownZigbeeDevice]);
        const createdDevice = await findDevice({
            filters: {
                ...query.filters,
                type: 'UNKNOWN',
            },
        });

        const knownZigbeeDevice = generateZigbeeDevice.temperatureAndHumiditySensor();
        knownZigbeeDevice.ieee_address = unknownZigbeeDevice.ieee_address;

        // when
        await H.publish([knownZigbeeDevice]);

        // then
        const updatedDevice = await findDevice({
            filters: {
                ...query.filters,
                type: 'END_DEVICE',
            },
        });

        expect(createdDevice).toHaveProperty('description', 'Unknown device');
        expect(updatedDevice).toHaveProperty('description', knownZigbeeDevice.definition.description);
    });
});
