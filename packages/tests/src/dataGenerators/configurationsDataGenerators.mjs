import { faker } from '@faker-js/faker';

export const generateConfigurationData = {
    zigbeeBridge: () => {
        return {
            type: 'ZIGBEE_BRIDGE',
            topicPrefix: 'zigbee2mqtt',
            permitDevicesJoin: false,
        };
    },
};

export const generateConfigurationPostPayload = () => {
    const generateData = faker.helpers.arrayElement([generateConfigurationData.zigbeeBridge]);

    return {
        data: generateData(),
        state: 'ACTIVE',
    };
};
