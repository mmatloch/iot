import { MqttClient } from '../../clients/mqttClient';
import {
    ZIGBEE_TOPIC_PREFIX,
    ZigbeeTopic,
    zigbeeDeviceDataSchema,
    zigbeeDevicesSchema,
    zigbeeInfoSchema,
} from './zigbeeDefinitions';
import { createZigbeeDeviceManager } from './zigbeeDeviceManager';
import { createDevicesHandler, onDevicesErrorHandler } from './zigbeeHandlers/zigbeeDevicesHandler';
import {
    createIncomingDeviceDataErrorHandler,
    createIncomingDeviceDataHandler,
} from './zigbeeHandlers/zigbeeIncomingDeviceDataHandler';
import { onInfoErrorHandler, onInfoHandler } from './zigbeeHandlers/zigbeeInfoHandler';

export const createZigbeeBridge = (mqttClient: MqttClient) => {
    const deviceSubMap: Map<number, string> = new Map();

    const initialize = async () => {
        await mqttClient.onMessage({
            handler: onInfoHandler,
            errorHandler: onInfoErrorHandler,
            topic: ZigbeeTopic.BridgeInfo,
            schema: zigbeeInfoSchema,
        });

        const zigbeeDeviceManager = createZigbeeDeviceManager();

        await mqttClient.onMessage({
            handler: createDevicesHandler(zigbeeDeviceManager),
            errorHandler: onDevicesErrorHandler,
            topic: ZigbeeTopic.BridgeDevices,
            schema: zigbeeDevicesSchema,
        });

        zigbeeDeviceManager.watch(async (device) => {
            const ieeeAddress = deviceSubMap.get(device._id);

            if (ieeeAddress === device.ieeeAddress) {
                console.log(`Already subscribed for device ${device._id}`);
                return;
            }

            const topic = `${ZIGBEE_TOPIC_PREFIX}/${device.ieeeAddress}`;

            try {
                await mqttClient.onMessage({
                    handler: createIncomingDeviceDataHandler(device),
                    errorHandler: createIncomingDeviceDataErrorHandler(device),
                    topic: topic,
                    schema: zigbeeDeviceDataSchema,
                });

                deviceSubMap.set(device._id, device.ieeeAddress);
            } catch (e) {
                console.log(`Failed to subscribe ${topic} for device ${device._id}`, e);
            }
        });
    };

    return {
        initialize,
    };
};
