import crypto from 'node:crypto';

import { BaseError } from '@common/errors';
import { faker } from '@faker-js/faker';
import JWT from 'jsonwebtoken';
import LRU from 'lru-cache';

import { getConfig } from '../config';

const authorizationCodes = new LRU({
    max: 1000,
    ttl: 60 * 60 * 1000, // 1h
});

const keyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: 'secret',
    },
});

interface TokenDto {
    clientId?: string;
    clientSecret?: string;
    grantType?: string;
    code?: string;
}

interface AuthorizeDto {
    redirectUri: string;
    responseType: string;
    clientId: string;
    scope: string;

    email: string;
    firstName?: string;
    lastName?: string;
}

enum OAuth2Error {
    UNSUPPORTED_GRANT_TYPE = 'unsupported_grant_type',
    INVALID_REQUEST = 'invalid_request',
    INVALID_CLIENT = 'invalid_client',
    INVALID_GRANT = 'invalid_grant',
}

const config = getConfig();

export const createGoogleOAuth2Service = () => {
    const createError = (error: OAuth2Error, description: string) => {
        throw new BaseError({ message: description, errorCode: error });
    };

    const validateTokenPayload = (dto: TokenDto): asserts dto is Required<TokenDto> => {
        const expectedClientId = config.oAuth2.clientId;
        const expectedClientSecret = config.oAuth2.clientSecret;

        const { grantType, code, clientId, clientSecret } = dto;

        if (grantType !== 'authorization_code') {
            return createError(OAuth2Error.UNSUPPORTED_GRANT_TYPE, `Invalid grant_type: ${grantType}`);
        }

        if (!code) {
            return createError(OAuth2Error.INVALID_REQUEST, 'Missing required parameter: code');
        }

        if (!clientId) {
            return createError(OAuth2Error.INVALID_REQUEST, 'Could not determine client ID from request.');
        }

        if (!clientSecret) {
            return createError(OAuth2Error.INVALID_REQUEST, 'client_secret is missing.');
        }

        if (expectedClientId !== clientId) {
            return createError(OAuth2Error.INVALID_CLIENT, 'The OAuth client was not found.');
        }

        if (expectedClientSecret !== clientSecret) {
            return createError(OAuth2Error.INVALID_CLIENT, 'Unauthorized');
        }
    };

    const createAuthorizationCode = (info: Record<string, unknown>) => {
        const code = faker.random.alpha(64);
        authorizationCodes.set(code, info);

        return {
            code,
        };
    };

    const getAuthorizationCode = (code: string): Record<string, unknown> | undefined => {
        return authorizationCodes.get(code);
    };

    const createToken = (dto: TokenDto) => {
        const validate: typeof validateTokenPayload = validateTokenPayload;
        validate(dto);

        const authorizationCodeInfo = getAuthorizationCode(dto.code);

        if (!authorizationCodeInfo) {
            return createError(OAuth2Error.INVALID_GRANT, 'Malformed auth code.');
        }

        const idToken = JWT.sign(
            authorizationCodeInfo,
            {
                key: keyPair.privateKey,
                passphrase: 'secret',
            },
            {
                algorithm: 'RS256',
                expiresIn: '1h',
            },
        );

        return {
            access_token: faker.random.alpha(164),
            id_token: idToken,
            expires_in: 3599,
            token_type: 'Bearer',
            scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid',
        };
    };

    const authorize = (dto: AuthorizeDto): string => {
        const givenName = dto.firstName || faker.name.firstName();
        const familyName = dto.lastName || faker.name.lastName();
        const name = `${givenName} ${familyName}`;

        const picture = new URL('https://ui-avatars.com/api');
        picture.searchParams.set('name', name);
        picture.searchParams.set('size', '96');

        const { code } = createAuthorizationCode({
            email: dto.email,
            email_verified: true,
            name,
            picture: picture.toString(),
            given_name: givenName,
            family_name: familyName,
            locale: 'pl',
            sub: '123456789',
        });

        const redirectUrl = new URL(dto.redirectUri);
        redirectUrl.searchParams.set('code', code);
        redirectUrl.searchParams.set('scope', dto.scope);

        return redirectUrl.toString();
    };

    return {
        createToken,
        createAuthorizationCode,
        authorize,
    };
};
