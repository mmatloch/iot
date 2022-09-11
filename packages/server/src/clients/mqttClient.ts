import { promisify } from 'util';

import { Validator, createValidator } from '@common/validator';
import { Static, TSchema } from '@sinclair/typebox';
import toCamelCase from 'camelcase-keys';
import fastq from 'fastq';
import _ from 'lodash';
import { IClientSubscribeOptions, connect } from 'mqtt';

import { getConfig } from '../config';
import { getLogger } from '../logger';
import { MqttMessageHandler, createMqttHandlerStore } from './mqttHandlerStore';

const config = getConfig();
const logger = getLogger();
const validator: Validator = createValidator();

type SubscribeFn = (topic: string | string[], opts?: IClientSubscribeOptions) => Promise<void>;
type UnsubscribeFn = (topic: string | string[]) => Promise<unknown>;
type PublishFn = (topic: string, data: unknown) => Promise<void>;

interface AddHandlerOptions<Schema extends TSchema> {
    onMessage: (payload: Static<Schema>) => Promise<void>;
    onError: (error: unknown) => Promise<void>;
    schema: Schema;
    topic: string;
}

type AddHandlerFn = <Schema extends TSchema>(opts: AddHandlerOptions<Schema>) => Promise<MqttMessageHandler>;

interface RemoveHandlerOptions {
    unsubscribe?: boolean;
}

type RemoveHandlerFn = (handler: MqttMessageHandler, opts?: RemoveHandlerOptions) => Promise<void>;
type RemoveHandlersByTopicFn = (topic: string, opts?: RemoveHandlerOptions) => Promise<void>;

export interface MqttClient {
    initialize: () => Promise<void>;
    addHandler: AddHandlerFn;
    removeHandler: RemoveHandlerFn;
    removeHandlersByTopic: RemoveHandlersByTopicFn;
    subscribe: SubscribeFn;
    unsubscribe: UnsubscribeFn;
    publish: PublishFn;
}

export const createMqttClient = (): MqttClient => {
    const client = connect(config.mqttBroker.url);

    const subscribeAsPromised = promisify(client.subscribe).bind(client);
    const unsubscribeAsPromised = promisify(client.unsubscribe).bind(client);
    const publishAsPromised = promisify(client.publish).bind(client);

    const handlerStore = createMqttHandlerStore();
    const subscriptionSet: Set<string> = new Set();

    const initialize = async (): Promise<void> => {
        client.on('message', async (topic, payload) => {
            logger.trace(`Received a message from the topic '${topic}'`);

            const handlers = handlerStore.get(topic);

            if (!handlers) {
                logger.warn(`No handler found for the topic '${topic}'`);

                return;
            }

            await Promise.all(handlers.map((handler) => handler.queue.push(payload)));
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

    const unsubscribe: UnsubscribeFn = async (topics) => {
        _.castArray(topics).forEach((topic) => logger.debug(`Unubscribing from the topic '${topic}'`));
        await unsubscribeAsPromised(topics);
    };

    const parseMessage = (message: Buffer): unknown => {
        const parsedPayload = JSON.parse(message.toString());

        return toCamelCase(parsedPayload, { deep: true });
    };

    const addHandler: AddHandlerFn = async ({ topic, onMessage, onError, schema }) => {
        const concurrency = 1;

        const wrappedOnMessage = async (message: Buffer) => {
            try {
                const parsedPayload = parseMessage(message);
                validator.validateOrThrow(schema, parsedPayload);

                return await onMessage(parsedPayload);
            } catch (e) {
                return onError(e);
            }
        };

        const queue = fastq.promise(wrappedOnMessage, concurrency);
        const handler = handlerStore.add(topic, queue);

        if (!subscriptionSet.has(topic)) {
            await subscribe(topic);
            subscriptionSet.add(topic);
        }

        return handler;
    };

    const removeHandler: RemoveHandlerFn = async (handler, opts) => {
        handlerStore.deleteHandler(handler);

        const optsWithDefaults = _.defaults(opts, {
            unsubscribe: true,
        });

        if (optsWithDefaults.unsubscribe && subscriptionSet.has(handler.topic)) {
            await unsubscribe(handler.topic);
            subscriptionSet.delete(handler.topic);
        }
    };

    const removeHandlersByTopic: RemoveHandlersByTopicFn = async (topic, opts) => {
        handlerStore.deleteTopic(topic);

        const optsWithDefaults = _.defaults(opts, {
            unsubscribe: true,
        });

        if (optsWithDefaults.unsubscribe && subscriptionSet.has(topic)) {
            await unsubscribe(topic);
            subscriptionSet.delete(topic);
        }
    };

    const publish: PublishFn = async (topic, data) => {
        logger.debug(`Publishing to the topic '${topic}'`);

        await publishAsPromised(topic, JSON.stringify(data));
    };

    return {
        initialize,
        addHandler,
        removeHandler,
        removeHandlersByTopic,
        unsubscribe,
        subscribe,
        publish,
    };
};
