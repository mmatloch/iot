import { faker } from '@faker-js/faker';

import { generateDeviceIeeeAddress } from './devicesDataGenerators.mjs';
import { generateSensorData } from './sensorDataGenerators.mjs';

export const generateEventDisplayName = () => `${faker.commerce.productName()}${faker.random.alpha(10)}`;
export const generateEventTriggerType = () =>
    faker.helpers.arrayElement(['API', 'INCOMING_DEVICE_DATA', 'OUTGOING_DEVICE_DATA']);

export const generateEventPostPayload = () => {
    return {
        displayName: generateEventDisplayName(),
        triggerType: generateEventTriggerType(),
        triggerFilters: {
            ieeeAddress: generateDeviceIeeeAddress(),
        },
        conditionDefinition: 'return true',
        actionDefinition: 'return true',
        state: 'ACTIVE',
    };
};

export const generateEventTriggerPayload = () => {
    return {
        filters: {
            triggerFilters: {
                ieeeAddress: generateDeviceIeeeAddress(),
            },
        },
        context: {
            sensorData: generateSensorData(),
        },
    };
};

export const generateEventSchedulerMetadata = () => {
    return {
        type: 'SCHEDULER',
        retryImmediatelyAfterBoot: faker.datatype.boolean(),
        taskType: faker.helpers.arrayElement(['STATIC_CRON', 'RELATIVE_CRON']),
        onMultipleInstances: faker.helpers.arrayElement(['CREATE', 'REPLACE', 'SKIP']),
        recurring: faker.datatype.boolean(),
        cronExpression: '0 0 * * *',
        interval: 3600,
        runAfterEvent: 99999999,
    };
};
