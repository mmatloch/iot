import { queueAsPromised } from 'fastq';
import _ from 'lodash';

type Queue = queueAsPromised<unknown, void>;
type Topic = string;

export interface MqttMessageHandler {
    id: number;
    queue: Queue;
    topic: Topic;
}

type HandlerMap = Map<Topic, MqttMessageHandler[]>;

export const createMqttHandlerStore = () => {
    const handlerMap: HandlerMap = new Map();

    const add = (topic: Topic, queue: Queue): MqttMessageHandler => {
        const handler = {
            id: Number(_.uniqueId()),
            queue,
            topic,
        };

        const handlers = handlerMap.get(topic) || [];
        handlers.push(handler);
        handlerMap.set(topic, handlers);

        return handler;
    };

    const get = (topic: Topic) => {
        return handlerMap.get(topic);
    };

    const deleteTopic = (topic: Topic) => {
        handlerMap.delete(topic);
    };

    const deleteHandler = (handlerToDelete: MqttMessageHandler) => {
        for (const [topic, handlers] of handlerMap.entries()) {
            const match = handlers.find((handler) => handler === handlerToDelete);

            if (match) {
                handlerMap.delete(topic);
            }
        }
    };

    return {
        add,
        get,
        deleteHandler,
        deleteTopic,
    };
};
