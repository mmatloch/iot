import { faker } from '@faker-js/faker';

export const generateGoogleUserInfo = () => {
    const givenName = faker.name.firstName();
    const familyName = faker.name.lastName();

    return {
        email: faker.internet.email(givenName, familyName, 'gmail.com'),
        email_verified: true,
        name: `${givenName} ${familyName}`,
        picture: faker.image.imageUrl(),
        given_name: givenName,
        family_name: familyName,
        locale: 'pl',
        sub: faker.random.numeric(21),
    };
};
