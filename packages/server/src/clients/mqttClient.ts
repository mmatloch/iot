import { promisify } from 'util';

import { Validator, createValidator } from '@common/validator';
import { Static, TSchema } from '@sinclair/typebox';
import toCamelCase from 'camelcase-keys';
import _ from 'lodash';
import { IClientSubscribeOptions, ISubscriptionGrant, connect } from 'mqtt';

import { getConfig } from '../config';

const config = getConfig();
const validator: Validator = createValidator();

type SubscribeFn = (topic: string | string[], opts?: IClientSubscribeOptions) => Promise<ISubscriptionGrant[]>;

interface OnMessageOptions<Schema extends TSchema> {
    handler: (payload: Static<Schema>) => Promise<void>;
    errorHandler: (error: unknown) => Promise<void>;
    schema: Schema;
    topic: string;
}
type OnMessageFn = <Schema extends TSchema>(opts: OnMessageOptions<Schema>) => Promise<void>;

type MessageHandlerMap = Map<
    string,
    {
        schema: TSchema;
        handler: (payload: Static<TSchema>) => Promise<void>;
        errorHandler: (error: unknown) => Promise<void>;
    }
>;

export interface MqttClient {
    initialize: () => Promise<void>;
    onMessage: OnMessageFn;
}

export const createMqttClient = (): MqttClient => {
    const client = connect(config.mqttBroker.url);
    const messageHandlers: MessageHandlerMap = new Map();

    const initialize = async (): Promise<void> => {
        client.on('message', async (topic, payload) => {
            console.log('Received message from topic', topic);
            const messageHandler = messageHandlers.get(topic);

            if (!messageHandler) {
                return;
            }

            const parsePayload = (payload: Buffer): unknown => {
                const parsedPayload = JSON.parse(payload.toString());

                return toCamelCase(parsedPayload, { deep: true });
            };

            try {
                const parsedPayload = parsePayload(payload);

                validator.validateOrThrow(messageHandler.schema, parsedPayload);
                await messageHandler.handler(parsedPayload);
            } catch (e) {
                await messageHandler.errorHandler(e);
            }
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

    const subscribe: SubscribeFn = promisify(client.subscribe).bind(client);

    const onMessage: OnMessageFn = async ({ topic, handler, errorHandler, schema }) => {
        messageHandlers.set(topic, {
            handler,
            errorHandler,
            schema,
        });

        console.log('Subscribing to topic', topic);
        await subscribe(topic);
    };

    return {
        initialize,
        onMessage,
    };
};
