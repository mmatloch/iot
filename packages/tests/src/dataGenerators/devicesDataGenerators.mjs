import { faker } from '@faker-js/faker';

const generateSwitchSensorData = () => {
    return {
        battery: faker.datatype.number(0, 100),
        voltage: faker.datatype.number(),
        linkQuality: faker.datatype.number(0, 255),
        action: faker.helpers.arrayElement(['single_left', 'single_right', 'single_both']),
    };
};

const generateMotionSensorData = () => {
    return {
        occupancy: faker.datatype.boolean(),
        batteryLow: faker.datatype.boolean(),
        tamper: faker.datatype.boolean(),
        voltage: faker.datatype.number(),
        linkQuality: faker.datatype.number(0, 255),
    };
};

const generateTemperatureSensorData = () => {
    return {
        battery: faker.datatype.number(0, 100),
        temperature: faker.datatype.number(0, 50),
        humidity: faker.datatype.number(0, 100),
        voltage: faker.datatype.number(),
        linkQuality: faker.datatype.number(0, 255),
    };
};

const generateBulbSensorData = () => {
    return {
        state: faker.helpers.arrayElement(['ON', 'OFF']),
        brightness: faker.datatype.number(0, 254),
        colorTemp: faker.datatype.boolean(0, 150),
        linkQuality: faker.datatype.number(0, 255),
    };
};

const sensorDataGenerators = [
    generateSwitchSensorData,
    generateMotionSensorData,
    generateTemperatureSensorData,
    generateBulbSensorData,
    () => ({}), // empty object
];

export const generateDevicePostPayload = () => {
    const generateSensorData = faker.helpers.arrayElement(sensorDataGenerators);

    return {
        displayName: faker.commerce.productName(),
        model: faker.vehicle.model(),
        vendor: faker.company.companyName(),
        description: faker.commerce.productDescription(),
        ieeeAddress: faker.vehicle.vin(),
        powerSource: faker.helpers.arrayElement([
            'UNKNOWN',
            'BATTERY',
            'MAINS_SINGLE_PHASE',
            'MAINS_THREE_PHASE',
            'DC',
        ]),
        type: faker.helpers.arrayElement(['UNKNOWN', 'COORDINATOR', 'END_DEVICE', 'ROUTER']),
        protocol: 'ZIGBEE',
        state: 'ACTIVE',
        sensorData: generateSensorData(),
    };
};
