import {
    generateZigbeeBridgeInfoPayload,
    generateZigbeeCoordinatorPayload,
    generateZigbeeTemperatureAndHumiditySensorPayload,
} from '../../dataGenerators/zigbeeDataGenerators.mjs';
import {
    createDeviceHelpers,
    createEventHelpers,
    createZigbeeBridgeDevicesHelpers,
    createZigbeeBridgeInfoHelpers,
} from '../../helpers/helpers.mjs';
import { connectToBroker, disconnectFromBroker } from '../../utils/mqttClient.mjs';

const H = createZigbeeBridgeDevicesHelpers();
const deviceHelpers = createDeviceHelpers();
const zigbeeInfoHelpers = createZigbeeBridgeInfoHelpers();
const eventHelpers = createEventHelpers();

/**
 * @group zigbeeBridge/createDevice
 */

describe('Zigbee bridge createDevice', () => {
    beforeAll(async () => {
        deviceHelpers.authorizeHttpClient();
        eventHelpers.authorizeHttpClient();
        await connectToBroker();
    });

    afterAll(async () => {
        await disconnectFromBroker();
    });

    it('should create a device from the Zigbee coordinator', async () => {
        // given
        const zigbeeDevice = generateZigbeeCoordinatorPayload();
        const bridgeInfo = generateZigbeeBridgeInfoPayload();

        const query = {
            ieeeAddress: zigbeeDevice.ieee_address,
        };

        // when
        await zigbeeInfoHelpers.publish(bridgeInfo);
        await H.publish([zigbeeDevice]);

        // then
        const {
            body: { _hits },
        } = await deviceHelpers.repeatSearch(query).expectHits(1);

        const [device] = _hits;
        expect(device).toMatchObject({
            state: 'UNCONFIGURED',

            protocol: 'ZIGBEE',
            powerSource: 'DC',
            type: 'COORDINATOR',
            displayName: zigbeeDevice.friendly_name,
            model: bridgeInfo.coordinator.type,
            vendor: 'Unknown',
            manufacturer: 'Unknown',
            description: 'Coordinator',
            ieeeAddress: zigbeeDevice.ieee_address,
            sensorData: {},
        });

        expect(device).not.toHaveProperty('deactivatedBy');
    });

    it(`should create a device with 'UNCONFIGURED' state if the Zigbee device has been interviewed`, async () => {
        // given
        const zigbeeDevice = generateZigbeeTemperatureAndHumiditySensorPayload();
        zigbeeDevice.interviewing = false;
        zigbeeDevice.interview_completed = true;

        const query = {
            ieeeAddress: zigbeeDevice.ieee_address,
        };

        // when
        await H.publish([zigbeeDevice]);

        // then
        const {
            body: { _hits },
        } = await deviceHelpers.repeatSearch(query).expectHits(1);

        const [device] = _hits;
        expect(device).toMatchObject({
            state: 'UNCONFIGURED',

            protocol: 'ZIGBEE',
            powerSource: 'BATTERY',
            type: 'END_DEVICE',
            displayName: zigbeeDevice.friendly_name,
            model: zigbeeDevice.definition.model,
            vendor: zigbeeDevice.definition.vendor,
            manufacturer: zigbeeDevice.manufacturer,
            description: zigbeeDevice.definition.description,
            ieeeAddress: zigbeeDevice.ieee_address,
            sensorData: {},
        });

        expect(device).not.toHaveProperty('deactivatedBy');
    });

    it(`should create a device with 'INTERVIEWING' state if the Zigbee device is being interviewed`, async () => {
        // given
        const zigbeeDevice = generateZigbeeTemperatureAndHumiditySensorPayload();
        zigbeeDevice.interviewing = true;
        zigbeeDevice.interview_completed = false;

        const query = {
            ieeeAddress: zigbeeDevice.ieee_address,
        };

        // when
        await H.publish([zigbeeDevice]);

        // then
        const {
            body: { _hits },
        } = await deviceHelpers.repeatSearch(query).expectHits(1);

        const [device] = _hits;
        expect(device).toMatchObject({
            state: 'INTERVIEWING',

            protocol: 'ZIGBEE',
            powerSource: 'BATTERY',
            type: 'END_DEVICE',
            displayName: zigbeeDevice.friendly_name,
            model: zigbeeDevice.definition.model,
            vendor: zigbeeDevice.definition.vendor,
            manufacturer: zigbeeDevice.manufacturer,
            description: zigbeeDevice.definition.description,
            ieeeAddress: zigbeeDevice.ieee_address,
            sensorData: {},
        });

        expect(device).not.toHaveProperty('deactivatedBy');
    });

    it(`should create a device with 'NEW' state if the Zigbee device has not been interviewed yet`, async () => {
        // given
        const zigbeeDevice = generateZigbeeTemperatureAndHumiditySensorPayload();
        zigbeeDevice.interviewing = false;
        zigbeeDevice.interview_completed = false;

        const query = {
            ieeeAddress: zigbeeDevice.ieee_address,
        };

        // when
        await H.publish([zigbeeDevice]);

        // then
        const {
            body: { _hits },
        } = await deviceHelpers.repeatSearch(query).expectHits(1);

        const [device] = _hits;
        expect(device).toMatchObject({
            state: 'NEW',

            protocol: 'ZIGBEE',
            powerSource: 'BATTERY',
            type: 'END_DEVICE',
            displayName: zigbeeDevice.friendly_name,
            model: zigbeeDevice.definition.model,
            vendor: zigbeeDevice.definition.vendor,
            manufacturer: zigbeeDevice.manufacturer,
            description: zigbeeDevice.definition.description,
            ieeeAddress: zigbeeDevice.ieee_address,
            sensorData: {},
        });

        expect(device).not.toHaveProperty('deactivatedBy');
    });

    it('should create default events', async () => {
        // given
        const zigbeeDevice = generateZigbeeTemperatureAndHumiditySensorPayload();
        const deviceQuery = {
            ieeeAddress: zigbeeDevice.ieee_address,
        };

        // when
        await H.publish([zigbeeDevice]);

        // then
        const {
            body: { _hits: devices },
        } = await deviceHelpers.repeatSearch(deviceQuery).expectHits(1);
        const [device] = devices;

        const incomingDeviceDataEventQuery = {
            triggerType: 'INCOMING_DEVICE_DATA',
        };
        const {
            body: { _hits: incomingDeviceDataEvents },
        } = await eventHelpers.search(incomingDeviceDataEventQuery).expectSuccess();

        const incomingDeviceDataEvent = incomingDeviceDataEvents.find((e) => e.triggerFilters.deviceId === device._id);

        expect(incomingDeviceDataEvent).toBeTruthy();
    });
});
