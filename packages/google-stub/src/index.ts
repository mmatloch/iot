import { createApplication } from '@common/application';
import _ from 'lodash';

import { getLogger } from './logger';
import { createOAuth2Rest } from './rest/oAuth2Rest';

const logger = getLogger();

createApplication({
    logger,
    hooks: {
        beforeReady: async (app) => {
            createOAuth2Rest(app);
        },
    },
});
