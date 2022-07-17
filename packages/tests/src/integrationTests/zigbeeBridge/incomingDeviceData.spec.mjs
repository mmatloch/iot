import { createDeviceHelpers, createEventHelpers, createZigbeeBridgeDevicesHelpers } from '../../helpers/helpers.mjs';

const zigbeeDeviceHelpers = createZigbeeBridgeDevicesHelpers();
const deviceHelpers = createDeviceHelpers();
const eventHelpers = createEventHelpers();

/**
 * @group zigbeeBridge/incomingDeviceData
 */

describe('Zigbee bridge incomingDeviceData', () => {
    beforeAll(async () => {
        deviceHelpers.authorizeHttpClient();
        eventHelpers.authorizeHttpClient();
        await connectToBroker();
    });

    afterAll(async () => {
        await disconnectFromBroker();
    });

    it(`should update the device's sensorData`, async () => {
        // given
        // when
        // then
    });
});
