import { promisify } from 'util';

import _ from 'lodash';
import { IClientSubscribeOptions, connect } from 'mqtt';

import { getConfig } from '../config';
import { getLogger } from '../logger';

const config = getConfig();
const logger = getLogger();

type SubscribeFn = (topic: string | string[], opts?: IClientSubscribeOptions) => Promise<void>;
type PublishFn = (topic: string, data: unknown) => Promise<void>;
type HandlerCallback = (payload: unknown) => Promise<void>;

export interface MqttClient {
    initialize: () => Promise<void>;
    addHandler: (topic: string, cb: HandlerCallback) => Promise<void>;
    publish: PublishFn;
}

export const createMqttClient = (): MqttClient => {
    const client = connect(config.mqttBroker.url);

    const handlerMap = new Map<string, HandlerCallback>();

    const subscribeAsPromised = promisify(client.subscribe).bind(client);
    const publishAsPromised = promisify(client.publish).bind(client);

    const initialize = async (): Promise<void> => {
        client.on('message', (topic, payload) => {
            logger.trace(`Received a message from the topic '${topic}'`);

            const handler = handlerMap.get(topic);

            if (!handler) {
                logger.warn(`No handler found for the topic '${topic}'`);

                return;
            }

            handler.call(undefined, payload);
        });

        return new Promise((resolve, reject) => {
            const listeners = {
                connect: () => {
                    removeListeners();
                    resolve();
                },
                error: (err: unknown) => {
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

    const subscribe: SubscribeFn = async (topics) => {
        _.castArray(topics).forEach((topic) => logger.debug(`Subscribing to the topic '${topic}'`));
        await subscribeAsPromised(topics);
    };

    const addHandler = async (topic: string, cb: HandlerCallback) => {
        handlerMap.set(topic, cb);
        await subscribe(topic);
    };

    const publish: PublishFn = async (topic, data) => {
        logger.debug(`Publishing to the topic '${topic}'`);

        await publishAsPromised(topic, JSON.stringify(data));
    };

    return {
        initialize,
        addHandler,
        publish,
    };
};
