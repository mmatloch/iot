import { MqttClient } from '../clients/mqttClient';
import { ZigbeeTopic, zigbeeDevicesSchema, zigbeeInfoSchema } from './zigbeeDefinitions';
import { onDevicesErrorHandler, onDevicesHandler } from './zigbeeHandlers/zigbeeDevicesHandler';
import { onInfoErrorHandler, onInfoHandler } from './zigbeeHandlers/zigbeeInfoHandler';

export const createZigbeeBridge = (mqttClient: MqttClient) => {
    const initialize = async () => {
        await mqttClient.onMessage({
            handler: onDevicesHandler,
            errorHandler: onDevicesErrorHandler,
            topic: ZigbeeTopic.BridgeDevices,
            schema: zigbeeDevicesSchema,
        });

        await mqttClient.onMessage({
            handler: onInfoHandler,
            errorHandler: onInfoErrorHandler,
            topic: ZigbeeTopic.BridgeInfo,
            schema: zigbeeInfoSchema,
        });
    };

    return {
        initialize,
    };
};
