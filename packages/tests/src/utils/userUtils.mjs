import { generateGoogleUserInfo } from '../dataGenerators/googleDataGenerators.mjs';
import { generateUserPostPayload } from '../dataGenerators/usersDataGenerators.mjs';
import { createGoogleOAuth2AuthorizationCodeHelpers, createUserHelpers } from '../helpers/helpers.mjs';

const userHelpers = createUserHelpers();
const userTokenHelpers = createUserHelpers({
    path: 'users/token',
});
const authorizationCodeHelpers = createGoogleOAuth2AuthorizationCodeHelpers();

export const createUserUtils = () => {
    userHelpers.authorizeHttpClient();

    const createUser = async () => {
        // create auth code
        const userInfo = generateGoogleUserInfo();

        const {
            body: { code },
        } = await authorizationCodeHelpers.post(userInfo).expectSuccess();

        // create user
        const payload = generateUserPostPayload();
        payload.authorizationCode = code;

        await userTokenHelpers.post(payload).expectConflict({
            detail: 'PENDING_APPROVAL',
        });

        // search for user
        const {
            body: { _hits },
        } = await userHelpers
            .search({
                email: userInfo.email,
            })
            .expectHits(1);

        return _hits[0];
    };

    return {
        createUser,
    };
};
