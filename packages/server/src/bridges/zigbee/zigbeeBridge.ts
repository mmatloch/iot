import { MqttClient } from '../../clients/mqttClient';
import { createZigbeeDataPublisher } from './zigbeeDataPublisher';
import { createZigbeeDataReceiver } from './zigbeeDataReceiver';

export const createZigbeeBridge = (mqttClient: MqttClient) => {
    const initialize = async () => {
        createZigbeeDataPublisher(mqttClient);
        await createZigbeeDataReceiver(mqttClient);
    };

    return {
        initialize,
    };
};
