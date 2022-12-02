import type { MqttClient } from '../../clients/mqttClient';
import type { ZigbeeBridgeConfiguration } from '../../entities/configurationEntity';
import { DeviceState } from '../../entities/deviceEntity';
import { getLogger } from '../../logger';
import { zigbeeDeviceDataSchema, zigbeeDevicesSchema, zigbeeInfoSchema } from './zigbeeDefinitions';
import { createZigbeeDeviceManager } from './zigbeeDeviceManager';
import { createDevicesHandler, onDevicesErrorHandler } from './zigbeeHandlers/zigbeeDevicesHandler';
import {
    createIncomingDeviceDataErrorHandler,
    createIncomingDeviceDataHandler,
} from './zigbeeHandlers/zigbeeIncomingDeviceDataHandler';
import { onInfoErrorHandler, onInfoHandler } from './zigbeeHandlers/zigbeeInfoHandler';

const logger = getLogger();

const getTopics = (prefix: string) => ({
    BridgeDevices: `${prefix}/bridge/devices`,
    BridgeInfo: `${prefix}/bridge/info`,
});

export const createZigbeeDataReceiver = (mqttClient: MqttClient) => {
    const deviceSubMap: Map<number, DeviceState> = new Map();
    const subscribedTopics = new Set<string>();

    const initialize = async (configuration: ZigbeeBridgeConfiguration) => {
        logger.debug('Initializing Zigbee data receiver');

        const ZigbeeTopic = getTopics(configuration.topicPrefix);

        await mqttClient.addHandler({
            onMessage: onInfoHandler,
            onError: onInfoErrorHandler,
            topic: ZigbeeTopic.BridgeInfo,
            schema: zigbeeInfoSchema,
        });

        subscribedTopics.add(ZigbeeTopic.BridgeInfo);

        const zigbeeDeviceManager = createZigbeeDeviceManager();

        await mqttClient.addHandler({
            onMessage: createDevicesHandler(zigbeeDeviceManager),
            onError: onDevicesErrorHandler,
            topic: ZigbeeTopic.BridgeDevices,
            schema: zigbeeDevicesSchema,
        });

        subscribedTopics.add(ZigbeeTopic.BridgeDevices);

        zigbeeDeviceManager.watch(async (device) => {
            const previousState = deviceSubMap.get(device._id);

            if (previousState === device.state) {
                return;
            }

            const topic = `${configuration.topicPrefix}/${device.ieeeAddress}`;

            if (previousState && device.state === DeviceState.Inactive) {
                try {
                    await mqttClient.removeHandlersByTopic(topic);
                    deviceSubMap.set(device._id, device.state);
                    subscribedTopics.delete(topic);
                } catch (e) {
                    logger.error({
                        msg: `Failed to remove handler from the topic '${topic}'`,
                        err: e,
                        device,
                    });
                }

                return;
            }

            try {
                await mqttClient.addHandler({
                    onMessage: createIncomingDeviceDataHandler(device),
                    onError: createIncomingDeviceDataErrorHandler(device),
                    topic: topic,
                    schema: zigbeeDeviceDataSchema,
                });

                deviceSubMap.set(device._id, device.state);
                subscribedTopics.add(topic);
            } catch (e) {
                logger.error({
                    msg: `Failed to add handler to the topic '${topic}'`,
                    err: e,
                    device,
                });
            }
        });
    };

    const finalize = async () => {
        logger.debug('Finalizing Zigbee data receiver');

        await Promise.all(
            Array.from(subscribedTopics).map(async (topic) => {
                try {
                    await mqttClient.removeHandlersByTopic(topic);
                    subscribedTopics.delete(topic);
                } catch (e) {
                    logger.error({
                        msg: `Failed to remove handler from the topic '${topic}'`,
                        err: e,
                    });
                }
            }),
        );
    };

    return {
        initialize,
        finalize,
    };
};
