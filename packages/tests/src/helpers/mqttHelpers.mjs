import _ from 'lodash';

import { createMqttClient } from '../utils/mqttClient.mjs';

export const createMqttHelpers = (topic) => {
    const mqttClient = createMqttClient();

    const publish = async (message) => {
        await mqttClient.publish(topic, message);
    };

    const subscribe = async (topic) => {
        const messages = [];

        const handler = (payload) => messages.push(payload);
        await mqttClient.subscribe(topic, handler);

        return messages;
    };

    return {
        publish,
        subscribe,
    };
};
