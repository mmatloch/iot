import { faker } from '@faker-js/faker';

export const generateUserPostPayload = () => {
    return {
        authorizationCode: faker.datatype.string(),
    };
};
