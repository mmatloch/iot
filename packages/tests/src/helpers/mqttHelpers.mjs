import _ from 'lodash';

import { createMqttClient } from '../utils/mqttClient.mjs';

export const createMqttHelpers = (topic) => {
    const mqttClient = createMqttClient();

    const publish = async (message) => {
        await mqttClient.publish(topic, message);
    };

    return {
        publish,
    };
};
