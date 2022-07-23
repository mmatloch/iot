import { createLogger } from '@common/logger';

import { getConfig } from './config';

const config = getConfig();

const logger = createLogger({
    level: config.logger.level,
    filePath: `/var/log/${config.app.name}/log`,
    rotationFrequency: config.logger.rotationFrequency,
});

export const getLogger = () => logger;
