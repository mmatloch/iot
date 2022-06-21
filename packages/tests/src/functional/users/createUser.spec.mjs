import { faker } from '@faker-js/faker';

import { generateGoogleUserInfo } from '../../dataGenerators/googleDataGenerators.mjs';
import { generateUserPostPayload } from '../../dataGenerators/usersDataGenerators.mjs';
import { createGoogleOAuth2AuthorizationCodeHelpers, createUsersHelpers } from '../../helpers/helpers.mjs';

const H = createUsersHelpers();
const authorizationCodeHelpers = createGoogleOAuth2AuthorizationCodeHelpers();

describe('Users createUser', () => {
    it('should create a user', async () => {
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
        const expectedProperties = ['email', 'name', 'lastName', 'firstName'];
        expectedProperties.forEach((property) => expect(body).toHaveProperty(property));
    });

    it('should return 409 if a user with the same email already exists', async () => {
        // given
        const userInfo = generateGoogleUserInfo();
        const {
            body: { code },
        } = await authorizationCodeHelpers.post(userInfo).expectSuccess();

        const payload = generateUserPostPayload();
        payload.authorizationCode = code;

        await H.post(payload).expectSuccess();

        // when & then
        await H.post(payload).expectConflict({
            errorCode: `SRV-2`,
            message: `Key (email)=(${userInfo.email}) already exists.`,
        });
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
