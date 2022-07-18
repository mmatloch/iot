import { generateZigbeeDevice, generateZigbeeIncomingData } from '../../dataGenerators/zigbeeDataGenerators.mjs';
import {
    createDeviceHelpers,
    createEventHelpers,
    createEventInstanceHelpers,
    createMqttHelpers,
    createSensorDataHelpers,
    createZigbeeBridgeDevicesHelpers,
} from '../../helpers/helpers.mjs';
import { sleep } from '../../utils/commonUtils.mjs';
import { connectToBroker, disconnectFromBroker } from '../../utils/mqttClient.mjs';
import { getZigbeeTopic } from '../../utils/zigbeeUtils.mjs';

const zigbeeDeviceHelpers = createZigbeeBridgeDevicesHelpers();
const deviceHelpers = createDeviceHelpers();
const eventHelpers = createEventHelpers();
const eventInstanceHelpers = createEventInstanceHelpers();
const sensorDataHelpers = createSensorDataHelpers();

const findDevice = async (query) => {
    const {
        body: { _hits },
    } = await deviceHelpers.repeatSearch(query).expectHits(1);

    return _hits[0];
};

const findEvent = async (query) => {
    const {
        body: { _hits },
    } = await eventHelpers.repeatSearch(query).expectHits(1);

    return _hits[0];
};

const findEventInstance = async (query) => {
    const {
        body: { _hits },
    } = await eventInstanceHelpers.repeatSearch(query).expectHits(1);

    return _hits[0];
};

const findSensorData = async (query) => {
    const {
        body: { _hits },
    } = await sensorDataHelpers.repeatSearch(query).expectHits(1);

    return _hits[0];
};

/**
 * @group zigbeeBridge/incomingDeviceData
 */

describe('Zigbee bridge incomingDeviceData', () => {
    beforeAll(async () => {
        deviceHelpers.authorizeHttpClient();
        eventHelpers.authorizeHttpClient();
        eventInstanceHelpers.authorizeHttpClient();
        sensorDataHelpers.authorizeHttpClient();
        await connectToBroker();
    });

    afterAll(async () => {
        await disconnectFromBroker();
    });

    it(`should create a SensorData`, async () => {
        // given
        const zigbeeDevice = generateZigbeeDevice.temperatureAndHumiditySensor();
        await zigbeeDeviceHelpers.publish([zigbeeDevice]);

        const deviceQuery = {
            ieeeAddress: zigbeeDevice.ieee_address,
        };

        const eventQuery = {
            name: `INCOMING_DEVICE_DATA_${zigbeeDevice.ieee_address}`,
        };

        const device = await findDevice(deviceQuery);
        const event = await findEvent(eventQuery);

        const H = createMqttHelpers(getZigbeeTopic(device).toReceiveData);

        const sensorData = generateZigbeeIncomingData.temperatureAndHumiditySensor();

        // when
        await H.publish(sensorData);

        // then
        const eventInstanceQuery = {
            eventId: event._id,
        };

        const eventInstance = await findEventInstance(eventInstanceQuery);
        expect(eventInstance).toMatchObject({
            state: 'SUCCESS',
            triggerContext: sensorData,
        });

        const sensorDataQuery = {
            deviceId: device._id,
        };

        const createdSensorData = await findSensorData(sensorDataQuery);
        expect(createdSensorData).toHaveProperty('data', sensorData);
    });

    it(`should not create SensorData when the device is inactive`, async () => {
        // given
        const zigbeeDevice = generateZigbeeDevice.temperatureAndHumiditySensor();

        // create a device
        await zigbeeDeviceHelpers.publish([zigbeeDevice]);

        // deactivate the device
        await zigbeeDeviceHelpers.publish([]);

        // prepare data
        const deviceQuery = {
            ieeeAddress: zigbeeDevice.ieee_address,
        };

        const eventQuery = {
            name: `INCOMING_DEVICE_DATA_${zigbeeDevice.ieee_address}`,
        };

        const device = await findDevice(deviceQuery);
        const event = await findEvent(eventQuery);

        const H = createMqttHelpers(getZigbeeTopic(device).toReceiveData);

        const sensorData = generateZigbeeIncomingData.temperatureAndHumiditySensor();

        // when
        await H.publish(sensorData);

        // then
        const sensorDataQuery = {
            deviceId: device._id,
        };

        const eventInstanceQuery = {
            eventId: event._id,
        };

        // wait for processing
        await sleep(1000);
        await eventInstanceHelpers.search(eventInstanceQuery).expectHits(0);
        await sensorDataHelpers.search(sensorDataQuery).expectHits(0);

        // activate the device
        await zigbeeDeviceHelpers.publish([zigbeeDevice]);

        // publish again
        await sleep(1000);
        await H.publish(sensorData);

        await eventInstanceHelpers.repeatSearch(eventInstanceQuery).expectHits(1);
        await sensorDataHelpers.search(sensorDataQuery).expectHits(1);
    });
});
