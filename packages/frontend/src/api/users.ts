import { useFetch } from '@hooks/useFetch';

import { createHttpClient } from '../clients/httpClient';
import { ApiRoute } from '../constants';

export interface TokenResponse {
    token: string;
    expiresIn: number;
    tokenType: string;
}

export interface SocialLoginResponse {
    google: {
        authenticationUrl: string;
    };
}

export const createToken = (authorizationCode: string) =>
    createHttpClient().request<TokenResponse>({
        url: ApiRoute.Users.Token,
        method: 'POST',
        body: {
            authorizationCode,
        },
    });

export const useGetSocialLogin = () =>
    useFetch<SocialLoginResponse>(
        {
            url: ApiRoute.Users.SocialLogin,
            method: 'GET',
        },
        {
            retry: false,
        },
    );
