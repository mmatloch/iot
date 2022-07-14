import { TransportTargetOptions, transport as createTransport, pino } from 'pino';

export interface LoggerOptions {
    development: {
        enable: boolean;
        level: string;
    };
    level: string;
    filePath: string;
    rotationFrequency: string;
}

export const createLogger = ({ development, level, filePath, rotationFrequency }: LoggerOptions) => {
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
        targets.push({
            level: development.level,
            target: 'pino-pretty',
            options: {
                colorize: true,
            },
        });
    }

    const transport = createTransport({
        targets,
    });

    return pino(transport);
};

export type { Logger } from 'pino';
