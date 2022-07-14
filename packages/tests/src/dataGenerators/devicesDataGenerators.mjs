import { faker } from '@faker-js/faker';

import { generateSensorData } from './sensorDataGenerators.mjs';

export const generateDevicePowerSource = () => {
    return faker.helpers.arrayElement(['UNKNOWN', 'BATTERY', 'MAINS_SINGLE_PHASE', 'MAINS_THREE_PHASE', 'DC']);
};

export const generateDeviceType = () => {
    return faker.helpers.arrayElement(['UNKNOWN', 'COORDINATOR', 'END_DEVICE', 'ROUTER']);
};

export const generateDeviceDisplayName = () => `${faker.commerce.productName()}${faker.random.alpha(10)}`;
export const generateDeviceIeeeAddress = () => `0x${faker.random.alpha(16)}`;

export const generateDevicePostPayload = () => {
    return {
        displayName: generateDeviceDisplayName(),
        model: faker.vehicle.model(),
        vendor: faker.company.companyName(),
        description: faker.commerce.productDescription(),
        ieeeAddress: generateDeviceIeeeAddress(),
        powerSource: generateDevicePowerSource(),
        type: generateDeviceType(),
        protocol: 'ZIGBEE',
        state: 'ACTIVE',
        sensorData: generateSensorData(),
    };
};
