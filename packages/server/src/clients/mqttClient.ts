import { promisify } from 'util';

import { Validator, createValidator } from '@common/validator';
import { Static, TSchema } from '@sinclair/typebox';
import toCamelCase from 'camelcase-keys';
import fastq, { queueAsPromised } from 'fastq';
import _ from 'lodash';
import { IClientSubscribeOptions, connect } from 'mqtt';

import { getConfig } from '../config';
import { getLogger } from '../logger';

const config = getConfig();
const logger = getLogger();
const validator: Validator = createValidator();

type SubscribeFn = (topic: string | string[], opts?: IClientSubscribeOptions) => Promise<void>;
type UnsubscribeFn = (topic: string | string[]) => Promise<unknown>;

interface AddHandlerOptions<Schema extends TSchema> {
    onMessage: (payload: Static<Schema>) => Promise<void>;
    onError: (error: unknown) => Promise<void>;
    schema: Schema;
    topic: string;
}

type AddHandlerFn = <Schema extends TSchema>(opts: AddHandlerOptions<Schema>) => Promise<void>;
type RemoveHandlerFn = (topic: string) => Promise<void>;

type HandlerMap = Map<string, queueAsPromised<unknown, void>>;

export interface MqttClient {
    initialize: () => Promise<void>;
    addHandler: AddHandlerFn;
    removeHandler: RemoveHandlerFn;
    subscribe: SubscribeFn;
    unsubscribe: UnsubscribeFn;
}

export const createMqttClient = (): MqttClient => {
    const client = connect(config.mqttBroker.url);

    const subscribePromise = promisify(client.subscribe).bind(client);
    const unsubscribePromise = promisify(client.unsubscribe).bind(client);

    const handlerMap: HandlerMap = new Map();
    const subscriptionSet: Set<string> = new Set();

    const initialize = async (): Promise<void> => {
        client.on('message', async (topic, payload) => {
            logger.trace(`Received a message from the topic '${topic}'`);

            const handler = handlerMap.get(topic);

            if (!handler) {
                logger.warn(`No handler found for the topic '${topic}'`);

                return;
            }

            await handler.push(payload);
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
        await subscribePromise(topics);
    };

    const unsubscribe: UnsubscribeFn = async (topics) => {
        _.castArray(topics).forEach((topic) => logger.debug(`Unubscribing from the topic '${topic}'`));
        await unsubscribePromise(topics);
    };

    const parseMessage = (message: Buffer): unknown => {
        const parsedPayload = JSON.parse(message.toString());

        return toCamelCase(parsedPayload, { deep: true });
    };

    const addHandler: AddHandlerFn = async ({ topic, onMessage, onError, schema }) => {
        const concurrency = 1;

        const wrappedOnMessage = (message: Buffer) => {
            const parsedPayload = parseMessage(message);
            validator.validateOrThrow(schema, parsedPayload);

            return onMessage(parsedPayload);
        };

        const wrappedOnError = (error: Error) => {
            if (error) {
                return onError(error);
            }

            return;
        };

        const queue = fastq.promise(wrappedOnMessage, concurrency);
        queue.error(wrappedOnError);

        handlerMap.set(topic, queue);

        if (!subscriptionSet.has(topic)) {
            await subscribe(topic);
            subscriptionSet.add(topic);
        }
    };

    const removeHandler: RemoveHandlerFn = async (topic) => {
        handlerMap.delete(topic);

        if (subscriptionSet.has(topic)) {
            await unsubscribe(topic);
            subscriptionSet.delete(topic);
        }
    };

    return {
        initialize,
        addHandler,
        removeHandler,
        unsubscribe,
        subscribe,
    };
};
