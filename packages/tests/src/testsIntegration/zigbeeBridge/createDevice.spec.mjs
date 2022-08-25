import { generateZigbeeBridgeInfo, generateZigbeeDevice } from '../../dataGenerators/zigbeeDataGenerators.mjs';
import {
    createDeviceHelpers,
    createEventHelpers,
    createZigbeeBridgeDevicesHelpers,
    createZigbeeBridgeInfoHelpers,
} from '../../helpers/helpers.mjs';
import { createConfigurationUtils } from '../../utils/configurationUtils.mjs';
import { connectToBroker, disconnectFromBroker } from '../../utils/mqttClient.mjs';

const H = createZigbeeBridgeDevicesHelpers();
const deviceHelpers = createDeviceHelpers();
const zigbeeInfoHelpers = createZigbeeBridgeInfoHelpers();
const eventHelpers = createEventHelpers();
const configurationUtils = createConfigurationUtils();

/**
 * @group zigbeeBridge/createDevice
 */

describe('Zigbee bridge createDevice', () => {
    beforeAll(async () => {
        deviceHelpers.authorizeHttpClient();
        eventHelpers.authorizeHttpClient();
        await configurationUtils.ensureZigbeeBridge();
        await connectToBroker();
    });

    afterAll(async () => {
        await disconnectFromBroker();
    });

    it('should create a device from the Zigbee coordinator', async () => {
        // given
        const zigbeeDevice = generateZigbeeDevice.coordinator();
        const bridgeInfo = generateZigbeeBridgeInfo();

        const query = {
            filters: {
                ieeeAddress: zigbeeDevice.ieee_address,
            },
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
            deactivatedBy: null,
        });
    });

    it(`should create a device with 'UNCONFIGURED' state if the Zigbee device has been interviewed`, async () => {
        // given
        const zigbeeDevice = generateZigbeeDevice.temperatureAndHumiditySensor();
        zigbeeDevice.interviewing = false;
        zigbeeDevice.interview_completed = true;

        const query = {
            filters: {
                ieeeAddress: zigbeeDevice.ieee_address,
            },
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
            deactivatedBy: null,
        });
    });

    it(`should create a device with 'INTERVIEWING' state if the Zigbee device is being interviewed`, async () => {
        // given
        const zigbeeDevice = generateZigbeeDevice.temperatureAndHumiditySensor();
        zigbeeDevice.interviewing = true;
        zigbeeDevice.interview_completed = false;

        const query = {
            filters: {
                ieeeAddress: zigbeeDevice.ieee_address,
            },
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
            deactivatedBy: null,
        });
    });

    it(`should create a device with 'NEW' state if the Zigbee device has not been interviewed yet`, async () => {
        // given
        const zigbeeDevice = generateZigbeeDevice.temperatureAndHumiditySensor();
        zigbeeDevice.interviewing = false;
        zigbeeDevice.interview_completed = false;

        const query = {
            filters: {
                ieeeAddress: zigbeeDevice.ieee_address,
            },
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
            deactivatedBy: null,
        });
    });

    it('should create default events', async () => {
        // given
        const zigbeeDevice = generateZigbeeDevice.temperatureAndHumiditySensor();
        const deviceQuery = {
            filters: {
                ieeeAddress: zigbeeDevice.ieee_address,
            },
        };

        // when
        await H.publish([zigbeeDevice]);

        // then
        const {
            body: { _hits: devices },
        } = await deviceHelpers.repeatSearch(deviceQuery).expectHits(1);
        const [device] = devices;

        const incomingDeviceDataEventQuery = {
            filters: {
                triggerType: 'INCOMING_DEVICE_DATA',
            },
        };

        const {
            body: { _hits: incomingDeviceDataEvents },
        } = await eventHelpers.search(incomingDeviceDataEventQuery).expectSuccess();

        const incomingDeviceDataEvent = incomingDeviceDataEvents.find((e) => e.triggerFilters.deviceId === device._id);

        expect(incomingDeviceDataEvent).toBeTruthy();
    });

    it('should create an unknown device', async () => {
        // given
        const zigbeeDevice = generateZigbeeDevice.unknown();
        zigbeeDevice.interviewing = false;
        zigbeeDevice.interview_completed = false;

        const query = {
            filters: {
                ieeeAddress: zigbeeDevice.ieee_address,
            },
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

            displayName: zigbeeDevice.friendly_name,
            ieeeAddress: zigbeeDevice.ieee_address,
            protocol: 'ZIGBEE',
            powerSource: 'UNKNOWN',
            type: 'UNKNOWN',
            model: 'Unknown',
            vendor: 'Unknown',
            manufacturer: 'Unknown',
            description: 'Unknown device',
            deactivatedBy: null,
        });
    });
});
