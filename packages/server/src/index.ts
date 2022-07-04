import { createApplication } from '@common/application';

import { getConfig } from './config';
import { ApplicationEnv } from './constants';
import { timescaleDataSource } from './dataSources/timescaleDataSource';
import requestUserPlugin from './plugins/requestUserPlugin';
import { createDevicesRest } from './rest/devicesRest';
import { createEventsRest } from './rest/eventsRest';
import { createUsersRest } from './rest/usersRest';

createApplication({
    hooks: {
        beforeReady: async (app) => {
            await timescaleDataSource.initialize();

            if (getConfig().app.env === ApplicationEnv.Development) {
                await timescaleDataSource.synchronize();
                await timescaleDataSource.runMigrations();
            }

            app.register(requestUserPlugin);
            app.register(createUsersRest);
            app.register(createDevicesRest);
            app.register(createEventsRest);
        },
    },
});
