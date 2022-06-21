import { getConfig } from '../config.mjs';
import { createHttpHelpers } from './httpHelpers.mjs';

const createHelpers = (resourceName) => {
    const config = getConfig();

    const resourceConfig = config.resources[resourceName];

    return {
        ...createHttpHelpers({ resourceConfig }),
    };
};

export const createUsersHelpers = (...opts) => createHelpers('users', ...opts);
export const createGoogleOAuth2AuthorizationCodeHelpers = (...opts) =>
    createHelpers('googleOAuth2AuthorizationCode', ...opts);
