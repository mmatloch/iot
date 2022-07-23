import { transformErrorBody } from '@common/errors';
import _ from 'lodash';
import { SerializerFn, TransportTargetOptions, pino } from 'pino';

export interface LoggerOptions {
    level: string;
    filePath: string;
    rotationFrequency: string;
}

const eventFields = ['_id', '_version', 'displayName', 'name'];
const deviceFields = ['_id', '_version', 'displayName', 'description', 'protocol', 'state'];
const requestFields = ['method', 'url', 'params', 'query', 'headers', 'user', 'ip'];
const replyFields = ['statusCode', 'request.method', 'request.url', 'request.user', 'request.ip'];

const eventSerializer: SerializerFn = (value) => _.pick(value, eventFields);
const deviceSerializer: SerializerFn = (value) => _.pick(value, deviceFields);
const errorSerializer: SerializerFn = (value) => transformErrorBody(value);
const requestSerializer: SerializerFn = (value) => _.pick(value, requestFields);
const replySerializer: SerializerFn = (value) => {
    return {
        ..._.pick(value, replyFields),
        headers: value.getHeaders(),
    };
};

export const createLogger = ({ level, filePath, rotationFrequency }: LoggerOptions) => {
    const targets: TransportTargetOptions[] = [
        {
            target: 'pino-roll',
            level,
            options: {
                file: filePath,
                frequency: rotationFrequency,
                mkdir: true,
            },
        },
        {
            target: 'pino-pretty',
            level,
            options: {
                colorize: true,
                translateTime: 'yyyy-mm-dd HH:MM:ss.l',
                ignore: 'pid,hostname',
            },
        },
    ];

    return pino({
        level,
        transport: {
            targets,
        },
        serializers: {
            event: eventSerializer,
            device: deviceSerializer,
            err: errorSerializer,
            req: requestSerializer,
            res: replySerializer,
        },
    });
};

export type { Logger } from 'pino';
