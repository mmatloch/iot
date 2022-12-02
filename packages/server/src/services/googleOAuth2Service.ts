import type { Validator} from '@common/validator';
import { createValidator } from '@common/validator';
import { Type } from '@sinclair/typebox';

import { getConfig } from '../config';
import { ApplicationEnv } from '../constants';
import { Errors } from '../errors';
import type { UserInfo} from '../utils/authUtils';
import { getUserInfoFromGoogleJWT } from '../utils/authUtils';

const config = getConfig();
const oAuth2Config = config.externalServices.google.oAuth2;

const tokenSchema = Type.Object({
    id_token: Type.String(),
});

export const createGoogleOAuth2Service = () => {
    const exchangeAuthorizationCodeForJWT = async (code: string): Promise<string> => {
        const url = new URL(oAuth2Config.tokenUrl);

        const requestBody = new URLSearchParams();
        requestBody.append('code', code);
        requestBody.append('client_id', oAuth2Config.clientId);
        requestBody.append('client_secret', oAuth2Config.clientSecret);
        requestBody.append('redirect_uri', oAuth2Config.redirectUri);
        requestBody.append('grant_type', 'authorization_code');

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: requestBody,
        });

        const body = await response.json();

        const validator: Validator = createValidator();
        validator.validateOrThrow(tokenSchema, body);

        return body.id_token;
    };

    const getUserInfo = async (code: string): Promise<UserInfo> => {
        let token;
        try {
            token = await exchangeAuthorizationCodeForJWT(code);
        } catch (e) {
            throw Errors.genericInternalError({ message: 'Failed to exchange authorization code for JWT', cause: e });
        }

        try {
            return getUserInfoFromGoogleJWT(token);
        } catch (e) {
            throw Errors.genericInternalError({ message: 'Failed to get user info from Google JWT', cause: e });
        }
    };

    const getAuthenticationUrl = (referer?: string) => {
        const redirectUri = new URL(config.externalServices.google.oAuth2.redirectUri);
        const authenticationUrl = new URL(config.externalServices.google.oAuth2.authBaseUrl);
        authenticationUrl.searchParams.append('client_id', config.externalServices.google.oAuth2.clientId);
        authenticationUrl.searchParams.append('redirect_uri', redirectUri.toString());
        authenticationUrl.searchParams.append('scope', config.externalServices.google.oAuth2.scope);
        authenticationUrl.searchParams.append('response_type', 'code');

        if (referer && config.app.env === ApplicationEnv.Development) {
            const refererUrl = new URL(referer);
            authenticationUrl.protocol = refererUrl.protocol;
            authenticationUrl.host = refererUrl.host;
            authenticationUrl.port = refererUrl.port;

            redirectUri.protocol = refererUrl.protocol;
            redirectUri.host = refererUrl.host;
            redirectUri.port = refererUrl.port;

            authenticationUrl.searchParams.set('redirect_uri', redirectUri.toString());
        }

        return authenticationUrl.toString();
    };

    return {
        getUserInfo,
        getAuthenticationUrl,
    };
};
