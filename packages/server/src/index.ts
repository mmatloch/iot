import { createApplication } from '@common/application';

import { createZigbeeBridge } from './bridges/zigbee/zigbeeBridge';
import { createMqttClient } from './clients/mqttClient';
import { getConfig } from './config';
import { ApplicationEnv } from './constants';
import { timescaleDataSource } from './dataSources/timescaleDataSource';
import { getLogger } from './logger';
import requestUserPlugin from './plugins/requestUserPlugin';
import { createDevicesRest } from './rest/devicesRest';
import { createEventsRest } from './rest/eventsRest';
import { createSensorDataRest } from './rest/sensorDataRest';
import { createUsersRest } from './rest/usersRest';

createApplication({
    logger: getLogger(),
    hooks: {
        beforeBootstrap: async (app) => {
            app.register(requestUserPlugin);
        },
        beforeReady: async (app) => {
            await timescaleDataSource.initialize();

            const mqttClient = createMqttClient();
            await mqttClient.initialize();

            if (getConfig().app.env === ApplicationEnv.Development) {
                await timescaleDataSource.synchronize();
                await timescaleDataSource.runMigrations();
            }

            app.register(createUsersRest);
            app.register(createDevicesRest);
            app.register(createEventsRest);
            app.register(createSensorDataRest);

            await createZigbeeBridge(mqttClient).initialize();
        },
    },
});
