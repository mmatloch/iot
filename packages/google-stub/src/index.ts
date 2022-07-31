import { createApplication } from '@common/application';
import _ from 'lodash';

import { getLogger } from './logger';
import { createOAuth2Rest } from './rest/oAuth2Rest';

const logger = getLogger();

createApplication({
    logger,
    loggerOptions: {
        logRequests: true,
        logResponses: true,
    },
    hooks: {
        beforeReady: async (app) => {
            createOAuth2Rest(app);
        },
    },
});
