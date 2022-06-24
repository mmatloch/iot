import { faker } from '@faker-js/faker';

import { generateGoogleUserInfo } from '../../dataGenerators/googleDataGenerators.mjs';
import { generateUserPostPayload } from '../../dataGenerators/usersDataGenerators.mjs';
import { createGoogleOAuth2AuthorizationCodeHelpers, createUserHelpers } from '../../helpers/helpers.mjs';

const H = createUserHelpers({
    path: 'users/token',
});
const authorizedUserHelpers = createUserHelpers();
const authorizationCodeHelpers = createGoogleOAuth2AuthorizationCodeHelpers();

describe('Users createToken', () => {
    beforeAll(() => {
        authorizedUserHelpers.authorizeHttpClient();
    });

    it('should create a token', async () => {
        // given
        const userInfo = generateGoogleUserInfo();
        const {
            body: { code },
        } = await authorizationCodeHelpers.post(userInfo).expectSuccess();

        const payload = generateUserPostPayload();
        payload.authorizationCode = code;

        // when
        const { body } = await H.post(payload).expectSuccess();

        // then
        const expectedProperties = ['token', 'expiresIn', 'tokenType'];
        expectedProperties.forEach((property) => expect(body).toHaveProperty(property));
    });

    it('should create a user if it does not exist', async () => {
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
        await H.post(payload).expectSuccess();

        // then
        await authorizedUserHelpers.search(searchQuery).expectHits(1);
    });

    it('should not create another user if a user with this email exists', async () => {
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

        await H.post(payload).expectSuccess();
        await authorizedUserHelpers.search(searchQuery).expectHits(1);

        // when
        await H.post(payload).expectSuccess();

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
