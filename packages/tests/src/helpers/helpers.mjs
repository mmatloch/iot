import JWT from 'jsonwebtoken';

import { getConfig } from '../config.mjs';
import { createHttpClient } from '../utils/httpClient.mjs';
import { createHttpHelpers } from './httpHelpers.mjs';

const createHelpers = (resourceName, resourceConfigOverrides = {}) => {
    const config = getConfig();
    const httpClient = createHttpClient();

    const resourceConfig = {
        ...config.resources[resourceName],
        ...resourceConfigOverrides,
    };

    const authorizeHttpClient = () => {
        const testUser = {
            _id: 1_000_000,
            email: 'test@example.com',
            role: 'ADMIN',
        };

        const token = JWT.sign(testUser, config.authorization.jwtSecret, {
            algorithm: 'HS256',
            expiresIn: '14d',
            subject: String(testUser._id),
        });

        httpClient.useAuthorizationStrategy({
            name: 'Test JWT token',
            getAuthorizationHeader: () => `JWT ${token}`,
        });
    };

    return {
        authorizeHttpClient,
        ...createHttpHelpers(httpClient, { resourceConfig }),
    };
};

export const createUserHelpers = (...opts) => createHelpers('users', ...opts);
export const createGoogleOAuth2AuthorizationCodeHelpers = (...opts) =>
    createHelpers('googleOAuth2AuthorizationCode', ...opts);
