import { faker } from '@faker-js/faker';

export const generateZigbeeBridgeRequestPayload = {
    permitDevicesJoin: () => {
        return {
            requestType: 'PERMIT_JOIN',
            value: faker.datatype.boolean(),
            time: faker.datatype.number({ min: 1, max: 10 }),
        };
    },
};
