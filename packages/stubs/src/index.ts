import { createApplication } from '@common/application';

import { getConfig } from './config';
import { getLogger } from './logger';
import { createGoogleOAuth2Rest } from './rest/googleOAuth2Rest';
import { createZigbee2mqttService } from './services/zigbee2mqttService';

const logger = getLogger();
const config = getConfig();

createApplication({
    logger,
    loggerOptions: {
        logRequests: true,
        logResponses: true,
    },
    urlPrefix: config.app.urlPrefix,
    hooks: {
        beforeReady: async (app) => {
            createGoogleOAuth2Rest(app);

            await createZigbee2mqttService().initialize();
        },
    },
});
