import { transformErrorBody } from '@common/errors';
import _ from 'lodash';
import { SerializerFn, TransportTargetOptions, levels, pino } from 'pino';

export interface LoggerOptions {
    development: {
        enable: boolean;
        level: string;
    };
    level: string;
    filePath: string;
    rotationFrequency: string;
}

const eventFields = ['_id', '_version', 'displayName', 'name'];
const deviceFields = ['_id', '_version', 'displayName', 'description', 'protocol', 'state'];
const requestFields = ['method', 'url', 'params', 'query', 'headers', 'user', 'ip'];
const replyFields = ['statusCode', 'request.user', 'request.ip'];

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

export const createLogger = ({ development, level, filePath, rotationFrequency }: LoggerOptions) => {
    let minLogLevel = level;

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
    ];

    if (development.enable) {
        if (levels.values[development.level] < levels.values[level]) {
            minLogLevel = development.level;
        }

        targets.push({
            target: 'pino-pretty',
            level: development.level,
            options: {
                colorize: true,
                translateTime: 'yyyy-mm-dd HH:MM:ss.l',
                ignore: 'pid,hostname',
            },
        });
    }

    return pino({
        level: minLogLevel,
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
