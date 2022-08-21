import { createApplication } from '@common/application';

import { createZigbeeBridge } from './bridges/zigbee/zigbeeBridge';
import { createMqttClient } from './clients/mqttClient';
import { getConfig } from './config';
import { timescaleDataSource } from './dataSources/timescaleDataSource';
import { createEventScheduler } from './events/scheduler/eventScheduler';
import { createEventSchedulerTaskProcessor } from './events/scheduler/eventSchedulerTaskProcessor';
import { getLogger } from './logger';
import requestUserPlugin from './plugins/requestUserPlugin';
import { createDevicesRest } from './rest/devicesRest';
import { createEventSchedulerTasksRest } from './rest/eventSchedulerTasksRest';
import { createEventsRest } from './rest/eventsRest';
import { createSensorDataRest } from './rest/sensorDataRest';
import { createUsersRest } from './rest/usersRest';

const config = getConfig();

createApplication({
    logger: getLogger(),
    loggerOptions: {
        logRequests: config.logger.logRequests,
        logResponses: config.logger.logResponses,
    },
    urlPrefix: config.app.urlPrefix,
    hooks: {
        beforeBootstrap: async (app) => {
            app.register(requestUserPlugin);
        },
        beforeReady: async (app) => {
            await timescaleDataSource.initialize();

            const mqttClient = createMqttClient();
            await mqttClient.initialize();

            await timescaleDataSource.runMigrations();

            app.register(createUsersRest);
            app.register(createDevicesRest);
            app.register(createEventsRest);
            app.register(createSensorDataRest);
            app.register(createEventSchedulerTasksRest);

            await createZigbeeBridge(mqttClient).initialize();
            createEventScheduler().initialize();
            createEventSchedulerTaskProcessor().initialize();
        },
    },
});
