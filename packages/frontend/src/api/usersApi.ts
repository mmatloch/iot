import { createHttpClient } from '@clients/httpClient';
import { SearchResponse } from '@definitions/commonTypes';
import { User, UserState } from '@definitions/userTypes';
import { useFetch } from '@hooks/useFetch';

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

export type UsersSearchResponse = SearchResponse<User>;

export const createToken = (authorizationCode: string) =>
    createHttpClient().request<TokenResponse>({
        url: ApiRoute.Users.Token,
        method: 'POST',
        body: {
            authorizationCode,
        },
    });

export const useGetSocialLogin = () =>
    useFetch<SocialLoginResponse>({
        url: ApiRoute.Users.SocialLogin,
        method: 'GET',
    });

export const useUsers = () =>
    useFetch<UsersSearchResponse>({
        url: ApiRoute.Users.Root,
        method: 'GET',
    });

export const updateUserState = (user: User, newState: UserState) =>
    createHttpClient().request<TokenResponse>({
        url: `${ApiRoute.Users.Root}/${user._id}`,
        method: 'PATCH',
        body: {
            state: newState,
        },
    });
