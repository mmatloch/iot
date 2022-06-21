import { createApplication } from '@common/application';
import _ from 'lodash';

import { createOAuth2Rest } from './rest/oAuth2Rest';

createApplication({
    hooks: {
        beforeReady: async (app) => {
            createOAuth2Rest(app);
        },
    },
});
