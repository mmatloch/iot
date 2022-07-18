import { faker } from '@faker-js/faker';
import _ from 'lodash';

import { generateZigbeeDevice } from '../../dataGenerators/zigbeeDataGenerators.mjs';
import { createDeviceHelpers, createZigbeeBridgeDevicesHelpers } from '../../helpers/helpers.mjs';
import { connectToBroker, disconnectFromBroker } from '../../utils/mqttClient.mjs';

const H = createZigbeeBridgeDevicesHelpers();
const deviceHelpers = createDeviceHelpers();

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
            ieeeAddress: zigbeeDevice.ieee_address,
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
            ...query,
            manufacturer: updatedZigbeeDevice.manufacturer, // unique
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
            ieeeAddress: zigbeeDevice.ieee_address,
        };

        // create
        await H.publish([zigbeeDevice]);
        await findDevice({
            ...query,
            state: 'UNCONFIGURED',
        });

        // deactivate
        await H.publish([]);
        const inactiveDevice = await findDevice({
            ...query,
            state: 'INACTIVE',
        });

        expect(inactiveDevice).toHaveProperty('deactivatedBy', {
            type: 'BRIDGE',
            name: 'Zigbee',
        });

        // when
        await H.publish([zigbeeDevice]);

        // then
        await findDevice({
            ...query,
            state: 'UNCONFIGURED',
        });
    });

    it('should update the state to "INTERVIEWING" if the device has entered the interviewing phase', async () => {
        // given
        const zigbeeDevice = generateZigbeeDevice.temperatureAndHumiditySensor();
        zigbeeDevice.interview_completed = false;
        zigbeeDevice.interviewing = false;

        const query = {
            ieeeAddress: zigbeeDevice.ieee_address,
        };

        // create
        await H.publish([zigbeeDevice]);
        await findDevice({
            ...query,
            state: 'NEW',
        });

        // start interview
        zigbeeDevice.interview_completed = false;
        zigbeeDevice.interviewing = true;

        // when
        await H.publish([zigbeeDevice]);

        // then
        await findDevice({
            ...query,
            state: 'INTERVIEWING',
        });
    });

    it('should update the state to "UNCONFIGURED" if the device has finished the interviewing phase', async () => {
        // given
        const zigbeeDevice = generateZigbeeDevice.temperatureAndHumiditySensor();
        zigbeeDevice.interview_completed = false;
        zigbeeDevice.interviewing = false;

        const query = {
            ieeeAddress: zigbeeDevice.ieee_address,
        };

        // create
        await H.publish([zigbeeDevice]);
        await findDevice({
            ...query,
            state: 'NEW',
        });

        // finish interview
        zigbeeDevice.interview_completed = true;
        zigbeeDevice.interviewing = false;

        // when
        await H.publish([zigbeeDevice]);

        // then
        await findDevice({
            ...query,
            state: 'UNCONFIGURED',
        });
    });
});
