import { faker } from '@faker-js/faker';

import { TEST_USER_EMAIL } from '../../constants.mjs';
import { generateGoogleUserInfo } from '../../dataGenerators/googleDataGenerators.mjs';
import { generateUserPostPayload } from '../../dataGenerators/usersDataGenerators.mjs';
import { createGoogleOAuth2AuthorizationCodeHelpers, createUserHelpers } from '../../helpers/helpers.mjs';

const H = createUserHelpers({
    path: 'users/token',
});
const authorizedUserHelpers = createUserHelpers();
const authorizationCodeHelpers = createGoogleOAuth2AuthorizationCodeHelpers();

/**
 * @group users/createToken
 */

describe('Users createToken', () => {
    beforeAll(() => {
        authorizedUserHelpers.authorizeHttpClient();
    });

    // currently, there is no way to test this
    it.skip('should create a user if it does not exist', async () => {
        // given
        const userInfo = generateGoogleUserInfo();
        userInfo.email = TEST_USER_EMAIL;

        const {
            body: { code },
        } = await authorizationCodeHelpers.post(userInfo).expectSuccess();

        const payload = generateUserPostPayload();
        payload.authorizationCode = code;

        const searchQuery = {
            email: userInfo.email,
        };

        await authorizedUserHelpers.search(searchQuery).expectHits(0);

        // when
        await H.post(payload).expectSuccess();

        // then
        await authorizedUserHelpers.search(searchQuery).expectHits(1);
    });

    it('should not create another user if a user with this email exists', async () => {
        // given
        const userInfo = generateGoogleUserInfo();
        userInfo.email = TEST_USER_EMAIL;

        const {
            body: { code },
        } = await authorizationCodeHelpers.post(userInfo).expectSuccess();

        const payload = generateUserPostPayload();
        payload.authorizationCode = code;

        const searchQuery = {
            email: userInfo.email,
        };

        await H.post(payload).expectSuccess();
        await authorizedUserHelpers.search(searchQuery).expectHits(1);

        // when
        await H.post(payload).expectSuccess();

        // then
        await authorizedUserHelpers.search(searchQuery).expectHits(1);
    });

    it('should not create a token for a newly created account', async () => {
        // given
        const userInfo = generateGoogleUserInfo();

        const {
            body: { code },
        } = await authorizationCodeHelpers.post(userInfo).expectSuccess();

        const payload = generateUserPostPayload();
        payload.authorizationCode = code;

        const searchQuery = {
            email: userInfo.email,
        };

        await authorizedUserHelpers.search(searchQuery).expectHits(0);

        // when
        await H.post(payload).expectConflict({
            errorCode: 'SRV-4',
            message: `Can't create access token for this user`,
            detail: 'PENDING_APPROVAL',
        });

        // then
        await authorizedUserHelpers.search(searchQuery).expectHits(1);
    });

    it('should return 500 if the authorizationCode is invalid', async () => {
        // given
        const payload = generateUserPostPayload();
        payload.authorizationCode = faker.datatype.string();

        // when & then
        await H.post(payload).expectInternalServerError({
            errorCode: `SRV-1`,
            message: 'Failed to exchange authorization code for JWT',
        });
    });
});
