import { createLogger } from '@common/logger';

import { getConfig } from './config';
import { ApplicationEnv } from './constants';

const config = getConfig();

const logger = createLogger({
    development: {
        enable: config.app.env === ApplicationEnv.Development,
        level: 'trace',
    },
    level: config.logger.level,
    filePath: `/var/log/${config.app.name}/log`,
    rotationFrequency: config.logger.rotationFrequency,
});

export const getLogger = () => logger;
