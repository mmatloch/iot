import { faker } from '@faker-js/faker';

export const generateEventName = () => `${faker.commerce.productName()}${faker.random.alpha(10)}`;
export const generateEventTriggerType = () =>
    faker.helpers.arrayElement(['INCOMING_DEVICE_DATA', 'OUTGOING_DEVICE_DATA']);

export const generateEventPostPayload = () => {
    return {
        name: generateEventName(),
        triggerType: generateEventTriggerType(),
        triggerFilters: {
            ieeeAddress: faker.vehicle.vin(),
        },
        conditionDefinition: 'return true',
        actionDefinition: 'return true',
    };
};
