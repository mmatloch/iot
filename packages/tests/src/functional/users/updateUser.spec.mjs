import { faker } from '@faker-js/faker';

import { createUserHelpers } from '../../helpers/helpers.mjs';
import { createUserUtils } from '../../utils/userUtils.mjs';

const { createUser } = createUserUtils();

const userUpdatableFields = [
    {
        field: 'firstName',
        generateValue: faker.name.firstName,
    },
    {
        field: 'lastName',
        generateValue: faker.name.lastName,
    },
    {
        field: 'name',
        generateValue: () => `${faker.name.firstName()} ${faker.name.lastName()}`,
    },
];

const userNotUpdatableFields = [
    {
        field: 'email',
        generateValue: () => faker.internet.email(undefined, undefined, 'gmail.com'),
    },
    {
        field: 'role',
        generateValue: () => 'ADMIN',
    },
    {
        field: 'state',
        generateValue: () => 'ACTIVE',
    },
];

const adminUpdatableFields = userUpdatableFields.concat(userNotUpdatableFields);

/**
 * @group users/updateUser
 */

describe('Users updateUser', () => {
    describe('generic', () => {
        const H = createUserHelpers();

        beforeAll(() => {
            H.authorizeHttpClient();
        });

        it('should return an error if the user does not exist', async () => {
            // given
            const payload = {
                firstName: faker.name.firstName(),
            };

            // when & then
            await H.patchById(faker.datatype.number({ min: 1000000 }), payload).expectNotFound({
                message: 'User does not exist',
                errorCode: 'SRV-5',
            });
        });

        it('should return an error if a user with this email already exists', async () => {
            // given
            const firstUser = await createUser();
            const secondUser = await createUser();

            const payload = {
                email: firstUser.email,
            };

            // when & then
            await H.patchById(secondUser._id, payload).expectConflict({
                message: `Key (email)=(${firstUser.email}) already exists.`,
                errorCode: 'SRV-6',
            });
        });
    });

    describe('as ADMIN', () => {
        const H = createUserHelpers();

        beforeAll(() => {
            H.authorizeHttpClient({
                role: 'ADMIN',
            });
        });

        it.each(adminUpdatableFields)(`should update '$field'`, async ({ field, generateValue }) => {
            // given
            const createdUser = await createUser();
            const newValue = generateValue();

            const payload = {
                [field]: newValue,
            };

            // when
            const { body: updatedUser } = await H.patchById(createdUser._id, payload).expectSuccess();

            // then
            const { body: user } = await H.getById(createdUser._id).expectSuccess();

            expect(user).toStrictEqual(updatedUser);

            expect(updatedUser[field]).toBe(newValue);
            expect(createdUser[field]).not.toBe(newValue);

            // check technical fields
            expect(updatedUser._version).toBe(createdUser._version + 1);
            expect(new Date(updatedUser._updatedAt)).toBeAfter(new Date(createdUser._updatedAt));
            expect(updatedUser._createdAt).toBe(createdUser._createdAt);
        });
    });

    describe('as USER', () => {
        const H = createUserHelpers();
        const adminUserHelpers = createUserHelpers();
        let createdUser;

        beforeEach(async () => {
            createdUser = await createUser();

            H.authorizeHttpClient({
                _id: createdUser._id,
                role: 'USER',
            });

            adminUserHelpers.authorizeHttpClient({
                _id: createdUser._id,
                role: 'ADMIN',
            });
        });

        it.each(userUpdatableFields)(`should update '$field'`, async ({ field, generateValue }) => {
            // given
            const newValue = generateValue();

            const payload = {
                [field]: newValue,
            };

            // when
            const { body: updatedUser } = await H.patchById(createdUser._id, payload).expectSuccess();

            // then
            const { body: user } = await adminUserHelpers.getById(createdUser._id).expectSuccess();

            expect(user).toStrictEqual(updatedUser);

            expect(updatedUser[field]).toBe(newValue);
            expect(createdUser[field]).not.toBe(newValue);

            // check technical fields
            expect(updatedUser._version).toBe(createdUser._version + 1);
            expect(new Date(updatedUser._updatedAt)).toBeAfter(new Date(createdUser._updatedAt));
            expect(updatedUser._createdAt).toBe(createdUser._createdAt);
        });

        it.each(userNotUpdatableFields)(`should not update '$field'`, async ({ field, generateValue }) => {
            // given
            const newValue = generateValue();

            const payload = {
                [field]: newValue,
            };

            // when
            await H.patchById(createdUser._id, payload).expectForbidden({
                message: `You don't have permission to update this field`,
                errorCode: 'SRV-7',
            });

            // then
            const { body: user } = await adminUserHelpers.getById(createdUser._id).expectSuccess();

            expect(user).toStrictEqual(createdUser);
        });

        it('should return an error when trying to update another user', async () => {
            // given
            const payload = {
                firstName: faker.name.firstName(),
            };

            // when & then
            await H.patchById(faker.datatype.number({ min: 1000000 }), payload).expectForbidden({
                errorCode: 'SRV-3',
            });
        });

        it('should update itself when using id "me"', async () => {
            // given
            const payload = {
                firstName: faker.name.firstName(),
            };

            // when
            const { body: updatedUser } = await H.patchById('me', payload).expectSuccess();

            // then
            expect(updatedUser).toHaveProperty('firstName', payload.firstName);
        });
    });
});
