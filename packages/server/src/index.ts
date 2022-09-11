import { createApplication } from '@common/application';
import { retry } from 'async';

import { createZigbeeBridge } from './bridges/zigbee/zigbeeBridge';
import { createMqttClient } from './clients/mqttClient';
import { getConfig } from './config';
import { timescaleDataSource } from './dataSources/timescaleDataSource';
import { createEventScheduler } from './events/scheduler/eventScheduler';
import { createEventSchedulerTaskProcessor } from './events/scheduler/eventSchedulerTaskProcessor';
import { getLogger } from './logger';
import requestLocalStoragePlugin from './plugins/requestLocalStoragePlugin';
import requestUserPlugin from './plugins/requestUserPlugin';
import { createBridgeRest } from './rest/bridgeRest';
import { createConfigurationsRest } from './rest/configurationsRest';
import { createDevicesRest } from './rest/devicesRest';
import { createEventSchedulerTasksRest } from './rest/eventSchedulerTasksRest';
import { createEventsRest } from './rest/eventsRest';
import { createSensorDataRest } from './rest/sensorDataRest';
import { createUsersRest } from './rest/usersRest';

const config = getConfig();

const RETRY_OPTIONS = {
    times: 15,
    interval: 1000,
};

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
            app.register(requestLocalStoragePlugin);
        },
        beforeReady: async (app) => {
            // DB may not be ready
            await retry(RETRY_OPTIONS, timescaleDataSource.initialize.bind(timescaleDataSource));

            await timescaleDataSource.runMigrations();

            // MQTT may not be ready
            const mqttClient = createMqttClient();
            await retry(RETRY_OPTIONS, mqttClient.initialize.bind(mqttClient));

            app.register(createUsersRest);
            app.register(createDevicesRest);
            app.register(createEventsRest);
            app.register(createSensorDataRest);
            app.register(createEventSchedulerTasksRest);
            app.register(createConfigurationsRest);
            app.register(createBridgeRest);

            await createZigbeeBridge(mqttClient).initialize();

            createEventScheduler().initialize();
            createEventSchedulerTaskProcessor().initialize();
        },
    },
});
