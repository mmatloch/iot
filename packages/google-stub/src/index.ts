import { createApplication } from '@common/application';
import _ from 'lodash';

import { getConfig } from './config';
import { getLogger } from './logger';
import { createOAuth2Rest } from './rest/oAuth2Rest';

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
            createOAuth2Rest(app);
        },
    },
});
