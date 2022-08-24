import { promisify } from 'node:util';

import _ from 'lodash';
import { connect } from 'mqtt';

import { getConfig } from '../config.mjs';

let client;

export const connectToBroker = () => {
    const config = getConfig();
    client = connect(config.mqttBroker.url);

    return new Promise((resolve, reject) => {
        const listeners = {
            connect: () => {
                removeListeners();
                resolve();
            },
            error: (err) => {
                removeListeners();
                client.end();
                reject(err);
            },
        };

        const removeListeners = () => {
            client.removeListener('connect', listeners.connect);
            client.removeListener('error', listeners.error);
        };

        client.addListener('connect', listeners.connect);
        client.addListener('error', listeners.error);
    });
};

export const disconnectFromBroker = async () => {
    const promiseEnd = promisify(client.end).bind(client);
    await promiseEnd();
};

export const createMqttClient = () => {
    const handlerMap = new Map();
    let isInitialized = false;

    const initialize = () => {
        if (isInitialized) {
            return;
        }

        client.on('message', (topic, payload) => {
            const handler = handlerMap.get(topic);

            if (!handler) {
                return;
            }

            handler(JSON.parse(payload));
        });

        isInitialized = true;
    };

    const publish = async (topic, message) => {
        if (!client) {
            throw new Error(`MQTT client is not initialized`);
        }

        const publishAsPromised = promisify(client.publish).bind(client);

        return publishAsPromised(topic, JSON.stringify(message));
    };

    const subscribe = async (topic, onMessage) => {
        if (!client) {
            throw new Error(`MQTT client is not initialized`);
        }

        initialize();

        handlerMap.set(topic, onMessage);

        const subscribeAsPromised = promisify(client.subscribe).bind(client);
        await subscribeAsPromised(topic);
    };

    return {
        publish,
        subscribe,
    };
};
