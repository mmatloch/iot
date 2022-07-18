import { MqttClient } from '../../clients/mqttClient';
import { DeviceState } from '../../entities/deviceEntity';
import { getLogger } from '../../logger';
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

const logger = getLogger();

export const createZigbeeDataReceiver = async (mqttClient: MqttClient) => {
    const deviceSubMap: Map<number, DeviceState> = new Map();

    await mqttClient.addHandler({
        onMessage: onInfoHandler,
        onError: onInfoErrorHandler,
        topic: ZigbeeTopic.BridgeInfo,
        schema: zigbeeInfoSchema,
    });

    const zigbeeDeviceManager = createZigbeeDeviceManager();

    await mqttClient.addHandler({
        onMessage: createDevicesHandler(zigbeeDeviceManager),
        onError: onDevicesErrorHandler,
        topic: ZigbeeTopic.BridgeDevices,
        schema: zigbeeDevicesSchema,
    });

    zigbeeDeviceManager.watch(async (device) => {
        const previousState = deviceSubMap.get(device._id);

        if (previousState === device.state) {
            return;
        }

        const topic = `${ZIGBEE_TOPIC_PREFIX}/${device.ieeeAddress}`;

        if (previousState && device.state === DeviceState.Inactive) {
            try {
                await mqttClient.removeHandler(topic);
                deviceSubMap.set(device._id, device.state);
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
        } catch (e) {
            logger.error({
                msg: `Failed to add handler to the topic '${topic}'`,
                err: e,
                device,
            });
        }
    });
};
