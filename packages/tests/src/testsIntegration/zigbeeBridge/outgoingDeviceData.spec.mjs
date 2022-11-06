import { generateEventPostPayload, generateEventTriggerPayload } from '../../dataGenerators/eventsDataGenerators.mjs';
import { generateZigbeeDevice } from '../../dataGenerators/zigbeeDataGenerators.mjs';
import {
    createDeviceHelpers,
    createEventHelpers,
    createEventInstanceHelpers,
    createEventTriggerHelpers,
    createMqttHelpers,
    createZigbeeBridgeDevicesHelpers,
} from '../../helpers/helpers.mjs';
import { sleep } from '../../utils/commonUtils.mjs';
import { createConfigurationUtils } from '../../utils/configurationUtils.mjs';
import { connectToBroker, disconnectFromBroker } from '../../utils/mqttClient.mjs';
import { getZigbeeTopic } from '../../utils/zigbeeUtils.mjs';

const H = createMqttHelpers();
const zigbeeDeviceHelpers = createZigbeeBridgeDevicesHelpers();
const deviceHelpers = createDeviceHelpers();
const eventHelpers = createEventHelpers();
const eventTriggerHelpers = createEventTriggerHelpers();
const eventInstanceHelpers = createEventInstanceHelpers();
const configurationUtils = createConfigurationUtils();

const findDevice = async (query) => {
    const {
        body: { _hits },
    } = await deviceHelpers.repeatSearch(query).expectHits(1);

    return _hits[0];
};

/**
 * @group zigbeeBridge/outgoingDeviceData
 */

describe('Zigbee bridge outgoingDeviceData', () => {
    beforeAll(async () => {
        deviceHelpers.authorizeHttpClient();
        eventHelpers.authorizeHttpClient();
        eventTriggerHelpers.authorizeHttpClient();
        eventInstanceHelpers.authorizeHttpClient();
        await configurationUtils.ensureZigbeeBridge();
        await connectToBroker();
    });

    let triggerFilters, device;

    beforeEach(async () => {
        // create a device
        const zigbeeDevice = generateZigbeeDevice.smartPlug();
        await zigbeeDeviceHelpers.publish([zigbeeDevice]);

        const deviceQuery = {
            filters: {
                ieeeAddress: zigbeeDevice.ieee_address,
            },
        };

        device = await findDevice(deviceQuery);

        triggerFilters = {
            deviceId: device._id,
        };

        // create an event
        const eventPayload = generateEventPostPayload();
        eventPayload.triggerType = 'API';
        eventPayload.triggerFilters = triggerFilters;
        eventPayload.actionDefinition = `
            const device = await sdk.devices.findByIdOrFail(${device._id});
            await sdk.devices.publishData(device, context);
        `;

        await eventHelpers.post(eventPayload).expectSuccess();
    });

    afterAll(async () => {
        await disconnectFromBroker();
    });

    it('should publish data', async () => {
        // given
        const topic = getZigbeeTopic(device).toPublishData;
        const receivedMessages = await H.subscribe(topic);
        expect(receivedMessages).toBeArrayOfSize(0);

        const triggerPayload = generateEventTriggerPayload();
        triggerPayload.context = {
            state: 'OFF',
        };
        triggerPayload.filters.triggerType = 'API';
        triggerPayload.filters.triggerFilters = triggerFilters;

        // when
        await eventTriggerHelpers.post(triggerPayload).expectSuccess();

        console.log(device);

        // then
        expect(receivedMessages).toBeArrayOfSize(1);
        expect(receivedMessages[0]).toStrictEqual(triggerPayload.context);
    });

    it('should not publish data when the device is inactive', async () => {
        // given
        await zigbeeDeviceHelpers.publish([]); // deactivate the device
        await sleep(500);

        const topic = getZigbeeTopic(device).toPublishData;
        const receivedMessages = await H.subscribe(topic);
        expect(receivedMessages).toBeArrayOfSize(0);

        const triggerPayload = generateEventTriggerPayload();
        triggerPayload.context = {
            state: 'OFF',
        };
        triggerPayload.filters.triggerType = 'API';
        triggerPayload.filters.triggerFilters = triggerFilters;

        // when
        await eventTriggerHelpers.post(triggerPayload).expectSuccess();

        // then
        expect(receivedMessages).toBeArrayOfSize(0);
    });

    it(`should trigger events with type 'OUTGOING_DEVICE_DATA'`, async () => {
        const eventPayload = generateEventPostPayload();
        eventPayload.triggerType = 'OUTGOING_DEVICE_DATA';
        eventPayload.triggerFilters = triggerFilters;

        const { body: event } = await eventHelpers.post(eventPayload).expectSuccess();

        const triggerPayload = generateEventTriggerPayload();
        triggerPayload.context = {
            state: 'OFF',
        };
        triggerPayload.filters.triggerType = 'API';
        triggerPayload.filters.triggerFilters = triggerFilters;

        // when
        await eventTriggerHelpers.post(triggerPayload).expectSuccess();

        // then
        const query = {
            filters: {
                eventId: event._id,
            },
        };

        const {
            body: { _hits: eventInstances },
        } = await eventInstanceHelpers.search(query).expectHits(1);
        const [eventInstance] = eventInstances;

        expect(eventInstance).toMatchObject({
            state: 'SUCCESS',
            triggerContext: triggerPayload.context,
        });
    });
});
