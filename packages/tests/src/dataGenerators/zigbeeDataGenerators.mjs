import { randomBytes } from 'node:crypto';

import { faker } from '@faker-js/faker';

export const generateZigbeeIeeeAddress = () => {
    return `0x${randomBytes(8).toString('hex')}`;
};

export const generateZigbeeLinkQuality = () => faker.datatype.number({ min: 0, max: 255 });

export const generateZigbeeIncomingData = {
    // https://www.zigbee2mqtt.io/devices/SNZB-04.html#sonoff-snzb-04
    contactSensor: () => {
        return {
            battery: faker.datatype.number({ min: 0, max: 100 }),
            battery_low: faker.datatype.boolean(),
            contact: faker.datatype.boolean(),
            linkquality: generateZigbeeLinkQuality(),
            tamper: faker.datatype.boolean(),
            voltage: faker.datatype.number({ min: 2900, max: 3200 }),
        };
    },

    // https://www.zigbee2mqtt.io/devices/SNZB-02.html#sonoff-snzb-02
    temperatureAndHumiditySensor: () => {
        return {
            battery: faker.datatype.number({ min: 0, max: 100 }),
            humidity: faker.datatype.float({ min: 0, max: 100, precision: 2 }),
            linkquality: generateZigbeeLinkQuality(),
            temperature: faker.datatype.number({ min: -20, max: 60 }),
            voltage: faker.datatype.number({ min: 2900, max: 3200 }),
        };
    },

    // https://www.zigbee2mqtt.io/devices/TS011F_plug_3.html#tuya-ts011f_plug_3
    smartPlug: () => {
        return {
            child_lock: faker.helpers.arrayElement('UNLOCK', 'LOCK'),
            current: faker.datatype.float({ min: 0, max: 2, precision: 2 }),
            energy: faker.datatype.float({ min: 0, max: 20, precision: 2 }),
            indicator_mode: faker.helpers.arrayElement('off/on', 'on/off', 'on', 'off'),
            linkquality: generateZigbeeLinkQuality(),
            power: faker.datatype.number({ min: 0, max: 3600 }),
            power_outage_memory: faker.helpers.arrayElement('restore', 'on', 'off'),
            state: faker.helpers.arrayElement(['ON', 'OFF']),
            voltage: faker.datatype.number({ min: 0, max: 240 }),
        };
    },

    // https://www.zigbee2mqtt.io/devices/TS0011.html#tuya-ts0011
    smartLightSwitch: () => {
        return {
            linkquality: generateZigbeeLinkQuality(),
            state: faker.helpers.arrayElement(['OFF', 'ON']),
        };
    },

    //  https://www.zigbee2mqtt.io/devices/BASICZBR3.html#sonoff-basiczbr3
    smartSwitch: () => {
        return {
            linkquality: generateZigbeeLinkQuality(),
            state: faker.helpers.arrayElement(['OFF', 'ON']),
        };
    },
};

export const generateZigbeeDevice = {
    coordinator: () => {
        const ieeeAddress = generateZigbeeIeeeAddress();

        return {
            definition: null,
            friendly_name: ieeeAddress,
            ieee_address: ieeeAddress,
            interview_completed: true,
            interviewing: false,
            network_address: 0,
            supported: false,
            type: 'Coordinator',
        };
    },

    motionSensor: () => {
        const ieeeAddress = generateZigbeeIeeeAddress();

        return {
            definition: {
                description: 'Motion sensor',
                model: 'TS0202',
                vendor: 'TuYa',
                exposes: [],
            },
            friendly_name: ieeeAddress,
            ieee_address: ieeeAddress,
            interview_completed: true,
            interviewing: false,
            manufacturer: '_TZ3000_wrgn6xrz',
            power_source: 'Battery',
            supported: true,
            type: 'EndDevice',
        };
    },

    temperatureAndHumiditySensor: () => {
        const ieeeAddress = generateZigbeeIeeeAddress();

        return {
            definition: {
                description: 'Temperature and humidity sensor',
                model: 'SNZB-02',
                vendor: 'SONOFF',
                exposes: [
                    {
                        access: 1,
                        description: 'Remaining battery in %, can take up to 24 hours before reported.',
                        name: 'battery',
                        property: 'battery',
                        type: 'numeric',
                        unit: '%',
                        valueMax: 100,
                        valueMin: 0,
                    },
                    {
                        access: 1,
                        description: 'Measured temperature value',
                        name: 'temperature',
                        property: 'temperature',
                        type: 'numeric',
                        unit: '°C',
                    },
                    {
                        access: 1,
                        description: 'Measured relative humidity',
                        name: 'humidity',
                        property: 'humidity',
                        type: 'numeric',
                        unit: '%',
                    },
                    {
                        access: 1,
                        description: 'Voltage of the battery in millivolts',
                        name: 'voltage',
                        property: 'voltage',
                        type: 'numeric',
                        unit: 'mV',
                    },
                    {
                        access: 1,
                        description: 'Link quality (signal strength)',
                        name: 'linkquality',
                        property: 'linkquality',
                        type: 'numeric',
                        unit: 'lqi',
                        valueMax: 255,
                        valueMin: 0,
                    },
                ],
            },
            friendly_name: ieeeAddress,
            ieee_address: ieeeAddress,
            interview_completed: true,
            interviewing: false,
            manufacturer: 'eWeLink',
            power_source: 'Battery',
            supported: true,
            type: 'EndDevice',
        };
    },

    contactSensor: () => {
        const ieeeAddress = generateZigbeeIeeeAddress();

        return {
            definition: {
                description: 'Contact sensor',
                model: 'SNZB-04',
                vendor: 'SONOFF',
                exposes: [],
            },

            friendly_name: ieeeAddress,
            ieee_address: ieeeAddress,
            interview_completed: true,
            interviewing: false,
            manufacturer: 'eWeLink',
            power_source: 'Battery',
            supported: true,
            type: 'EndDevice',
        };
    },

    smartPlug: () => {
        const ieeeAddress = generateZigbeeIeeeAddress();

        return {
            definition: {
                description: 'Smart plug (with power monitoring)',
                model: 'TS011F_plug_1',
                vendor: 'TuYa',
                exposes: [
                    {
                        features: [
                            {
                                access: 7,
                                description: 'On/off state of the switch',
                                name: 'state',
                                property: 'state',
                                type: 'binary',
                                valueOff: 'OFF',
                                valueOn: 'ON',
                                valueToggle: 'TOGGLE',
                            },
                        ],
                        type: 'switch',
                    },
                    {
                        access: 7,
                        description: 'Recover state after power outage',
                        name: 'power_outage_memory',
                        property: 'power_outage_memory',
                        type: 'enum',
                        values: ['on', 'off', 'restore'],
                    },
                    {
                        access: 7,
                        description: 'LED indicator mode',
                        name: 'indicator_mode',
                        property: 'indicator_mode',
                        type: 'enum',
                        values: ['off', 'off/on', 'on/off', 'on'],
                    },
                    {
                        access: 1,
                        description: 'Instantaneous measured power',
                        name: 'power',
                        property: 'power',
                        type: 'numeric',
                        unit: 'W',
                    },
                    {
                        access: 1,
                        description: 'Instantaneous measured electrical current',
                        name: 'current',
                        property: 'current',
                        type: 'numeric',
                        unit: 'A',
                    },
                    {
                        access: 1,
                        description: 'Measured electrical potential value',
                        name: 'voltage',
                        property: 'voltage',
                        type: 'numeric',
                        unit: 'V',
                    },
                    {
                        access: 1,
                        description: 'Sum of consumed energy',
                        name: 'energy',
                        property: 'energy',
                        type: 'numeric',
                        unit: 'kWh',
                    },
                    {
                        features: [
                            {
                                access: 3,
                                description: 'Enables/disables physical input on the device',
                                name: 'state',
                                property: 'child_lock',
                                type: 'binary',
                                valueOff: 'UNLOCK',
                                valueOn: 'LOCK',
                            },
                        ],
                        type: 'lock',
                    },
                    {
                        access: 1,
                        description: 'Link quality (signal strength)',
                        name: 'linkquality',
                        property: 'linkquality',
                        type: 'numeric',
                        unit: 'lqi',
                        valueMax: 255,
                        valueMin: 0,
                    },
                ],
            },
            friendly_name: ieeeAddress,
            ieee_address: ieeeAddress,
            interview_completed: true,
            interviewing: false,
            manufacturer: '_TZ3000_amdymr7l',
            power_source: 'Mains (single phase)',
            supported: true,
            type: 'Router',
        };
    },

    smartLightSwitch: () => {
        const ieeeAddress = generateZigbeeIeeeAddress();

        return {
            definition: {
                description: 'Smart light switch - 1 gang',
                model: 'TS0011',
                vendor: 'TuYa',
                exposes: [],
            },
            friendly_name: ieeeAddress,
            ieee_address: ieeeAddress,
            interview_completed: true,
            interviewing: false,
            manufacturer: '_TYZB01_7pytyxfm',
            power_source: 'Mains (single phase)',
            supported: true,
            type: 'EndDevice',
        };
    },

    smartSwitch: () => {
        const ieeeAddress = generateZigbeeIeeeAddress();

        return {
            definition: {
                description: 'Zigbee smart switch',
                model: 'BASICZBR3',
                vendor: 'SONOFF',
                exposes: [
                    {
                        features: [
                            {
                                access: 7,
                                description: 'On/off state of the switch',
                                name: 'state',
                                property: 'state',
                                type: 'binary',
                                valueOff: 'OFF',
                                valueOn: 'ON',
                                valueToggle: 'TOGGLE',
                            },
                        ],
                        type: 'switch',
                    },
                    {
                        access: 1,
                        description: 'Link quality (signal strength)',
                        name: 'linkquality',
                        property: 'linkquality',
                        type: 'numeric',
                        unit: 'lqi',
                        valueMax: 255,
                        valueMin: 0,
                    },
                ],
            },
            friendly_name: ieeeAddress,
            ieee_address: ieeeAddress,
            interview_completed: true,
            interviewing: false,
            manufacturer: 'SONOFF',
            power_source: 'Mains (single phase)',
            supported: true,
            type: 'Router',
        };
    },

    unknown: () => {
        const ieeeAddress = generateZigbeeIeeeAddress();

        return {
            friendly_name: ieeeAddress,
            ieee_address: ieeeAddress,
            interview_completed: true,
            interviewing: false,
            supported: true,
            type: 'Unknown',
        };
    },
};

export const generateZigbeeDevices = (count = 1) =>
    faker.helpers
        .arrayElements(
            [
                generateZigbeeDevice.motionSensor,
                generateZigbeeDevice.temperatureAndHumiditySensor,
                generateZigbeeDevice.smartPlug,
                generateZigbeeDevice.smartLightSwitch,
                generateZigbeeDevice.contactSensor,
                generateZigbeeDevice.smartSwitch,
            ],
            count,
        )
        .map((e) => e());

export const generateZigbeeBridgeInfo = () => {
    return {
        commit: '3f6a137',
        coordinator: {
            ieee_address: generateZigbeeIeeeAddress(),
            meta: {
                maintrel: 1,
                majorrel: 2,
                minorrel: 7,
                product: 1,
                revision: 20210708,
                transportrev: 2,
            },
            type: 'zStack3x0',
        },
        permit_join: false,
        restart_required: false,
        version: '1.25.1',
    };
};
