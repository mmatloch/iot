import { faker } from '@faker-js/faker';
import _ from 'lodash';

import { createUserHelpers } from '../../helpers/helpers.mjs';
import { createUserUtils } from '../../utils/userUtils.mjs';

const H = createUserHelpers();
const adminUserHelpers = createUserHelpers();
const { createUser } = createUserUtils();

/**
 * @group users/getUser
 */

describe('Users getUser', () => {
    let currentUser;
    beforeAll(async () => {
        currentUser = await createUser();

        H.authorizeHttpClient({
            _id: currentUser._id,
        });

        adminUserHelpers.authorizeHttpClient({
            role: 'ADMIN',
        });
    });

    it('should return the currently logged in user when using "@me"', async () => {
        // when
        const { body: user } = await H.getById('me').expectSuccess();

        // then
        expect(user).toStrictEqual(currentUser);
    });

    describe('as USER', () => {
        it('should not be allowed to get another user', async () => {
            //given
            const anotherUser = await createUser();

            // when & then
            await H.getById(anotherUser._id).expectForbidden({
                errorCode: 'SRV-3',
            });

            await H.getById(faker.datatype.number({ min: 1000000 })).expectForbidden({
                errorCode: 'SRV-3',
            });
        });
    });

    describe('as ADMIN', () => {
        it('should return an error if the user does not exist', async () => {
            await adminUserHelpers.getById(faker.datatype.number({ min: 1000000 })).expectNotFound({
                message: 'User does not exist',
                errorCode: 'SRV-5',
            });
        });

        it('should be allowed to get another user', async () => {
            //given
            const anotherUser = await createUser();

            // when
            const { body: user } = await adminUserHelpers.getById(anotherUser._id).expectSuccess();

            expect(user).toStrictEqual(anotherUser);
        });
    });
});
