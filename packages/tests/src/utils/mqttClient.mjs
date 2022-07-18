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
    const publish = async (topic, message) => {
        const publishPromise = promisify(client.publish).bind(client);

        return publishPromise(topic, JSON.stringify(message));
    };

    return {
        publish,
    };
};
