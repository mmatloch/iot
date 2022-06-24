import _ from 'lodash';

import { generateGoogleUserInfo } from '../../dataGenerators/googleDataGenerators.mjs';
import { generateUserPostPayload } from '../../dataGenerators/usersDataGenerators.mjs';
import { createGoogleOAuth2AuthorizationCodeHelpers, createUserHelpers } from '../../helpers/helpers.mjs';

const H = createUserHelpers();
const userTokenHelpers = createUserHelpers({
    path: 'users/token',
});
const authorizationCodeHelpers = createGoogleOAuth2AuthorizationCodeHelpers();

const createUser = async () => {
    const userInfo = generateGoogleUserInfo();
    const {
        body: { code },
    } = await authorizationCodeHelpers.post(userInfo).expectSuccess();

    const payload = generateUserPostPayload();
    payload.authorizationCode = code;

    await userTokenHelpers.post(payload).expectSuccess();

    return userInfo;
};

describe('Users searchUsers', () => {
    beforeAll(() => {
        H.authorizeHttpClient();
    });

    it('should find the user by email', async () => {
        // given
        const numberOfUsers = 3;
        const [firstUser, secondUser] = await Promise.all(_.times(numberOfUsers, createUser));

        // when
        const { body: firstUserResult } = await H.search({
            email: firstUser.email,
        }).expectHits(1);

        const { body: secondUserResult } = await H.search({
            email: secondUser.email,
        }).expectHits(1);

        // then
        expect(firstUserResult._hits[0]).toHaveProperty('email', firstUser.email);
        expect(secondUserResult._hits[0]).toHaveProperty('email', secondUser.email);
    });

    it('should return all users when no filter is specified', async () => {
        // given
        const numberOfUsers = 3;
        await Promise.all(_.times(numberOfUsers, createUser));

        const searchQuery = {};

        // when
        const { body } = await H.search(searchQuery).expectSuccess();

        // then
        expect(body._hits.length).toBeGreaterThanOrEqual(numberOfUsers);
    });
});
