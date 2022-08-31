import { faker } from '@faker-js/faker';

export const generateGoogleUserInfo = () => {
    const givenName = faker.name.firstName();
    const familyName = faker.name.lastName();
    const name = `${givenName} ${familyName}`;

    const picture = new URL('https://ui-avatars.com/api');
    picture.searchParams.set('name', name);
    picture.searchParams.set('size', '96');

    return {
        email: faker.internet.email(givenName, familyName, 'gmail.com'),
        email_verified: true,
        name,
        picture: picture.toString(),
        given_name: givenName,
        family_name: familyName,
        locale: 'pl',
        sub: faker.random.numeric(21),
    };
};
