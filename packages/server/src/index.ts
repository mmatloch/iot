import { createApplication } from '@common/application';

import { timescaleDataSource } from './dataSources/timescaleDataSource';
import requestUserPlugin from './plugins/requestUserPlugin';
import { createDevicesRest } from './rest/devicesRest';
import { createUsersRest } from './rest/usersRest';

createApplication({
    hooks: {
        beforeReady: async (app) => {
            await timescaleDataSource.initialize();

            app.register(requestUserPlugin);
            app.register(createUsersRest);
            app.register(createDevicesRest);
        },
    },
});
