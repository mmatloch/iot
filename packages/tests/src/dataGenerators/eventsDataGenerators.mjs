import { faker } from '@faker-js/faker';

import { generateDeviceIeeeAddress } from './devicesDataGenerators.mjs';
import { generateSensorData } from './sensorDataGenerators.mjs';

export const generateEventName = () => `${faker.commerce.productName()}${faker.random.alpha(10)}`;
export const generateEventDisplayName = () => `${faker.commerce.productName()}${faker.random.alpha(10)}`;
export const generateEventTriggerType = () =>
    faker.helpers.arrayElement(['API', 'INCOMING_DEVICE_DATA', 'OUTGOING_DEVICE_DATA']);

export const generateEventPostPayload = () => {
    return {
        name: generateEventName(),
        displayName: generateEventDisplayName(),
        triggerType: generateEventTriggerType(),
        triggerFilters: {
            ieeeAddress: generateDeviceIeeeAddress(),
        },
        conditionDefinition: 'return true',
        actionDefinition: 'return true',
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
