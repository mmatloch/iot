import { randomBytes } from 'node:crypto';

import { faker } from '@faker-js/faker';

export const generateZigbeeIeeeAddress = () => {
    return `0x${randomBytes(8).toString('hex')}`;
};

export const generateZigbeeCoordinatorPayload = () => {
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
};

export const generateZigbeeMotionSensorPayload = () => {
    const ieeeAddress = generateZigbeeIeeeAddress();

    return {
        definition: {
            description: 'Motion sensor',
            model: 'TS0202',
            vendor: 'TuYa',
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
};

export const generateZigbeeTemperatureAndHumiditySensorPayload = () => {
    const ieeeAddress = generateZigbeeIeeeAddress();

    return {
        definition: {
            description: 'Temperature and humidity sensor',
            model: 'SNZB-02',
            vendor: 'SONOFF',
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
};

export const generateZigbeeContactSensorPayload = () => {
    const ieeeAddress = generateZigbeeIeeeAddress();

    return {
        definition: {
            description: 'Contact sensor',
            model: 'SNZB-04',
            vendor: 'SONOFF',
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
};

export const generateZigbeeSmartPlugPayload = () => {
    const ieeeAddress = generateZigbeeIeeeAddress();

    return {
        definition: {
            description: 'Smart plug (with power monitoring by polling)',
            model: 'TS011F_plug_3',
            vendor: 'TuYa',
        },
        friendly_name: ieeeAddress,
        ieee_address: ieeeAddress,
        interview_completed: true,
        interviewing: false,
        manufacturer: '_TZ3000_gjnozsaz',
        power_source: 'Mains (single phase)',
        supported: true,
        type: 'Router',
    };
};

export const generateZigbeeSmartLightSwitchPayload = () => {
    const ieeeAddress = generateZigbeeIeeeAddress();

    return {
        definition: {
            description: 'Smart light switch - 1 gang',
            model: 'TS0011',
            vendor: 'TuYa',
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
};

export const generateZigbeeDevicesPayload = (count = 1) =>
    faker.helpers
        .arrayElements(
            [
                generateZigbeeMotionSensorPayload,
                generateZigbeeTemperatureAndHumiditySensorPayload,
                generateZigbeeContactSensorPayload,
                generateZigbeeSmartPlugPayload,
                generateZigbeeSmartLightSwitchPayload,
            ],
            count,
        )
        .map((e) => e());

export const generateZigbeeBridgeDevicesPayload = () => [
    generateZigbeeCoordinatorPayload(),
    ...generateZigbeeDevicesPayload(),
];

export const generateZigbeeBridgeInfoPayload = () => {
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
        permit_join: true,
        restart_required: false,
        version: '1.25.1',
    };
};
