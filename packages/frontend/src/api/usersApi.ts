import { createHttpClient } from '@clients/httpClient';
import { SearchQuery, SearchResponse } from '@definitions/searchTypes';
import { User } from '@definitions/userTypes';
import { useFetch } from '@hooks/useFetch';
import { useGenericMutation } from '@hooks/useGenericMutation';
import { useQueryClient } from 'react-query';

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

export type UsersSearchQuery = SearchQuery<User>;
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

export const useUsers = (query: UsersSearchQuery) =>
    useFetch<UsersSearchResponse>(
        {
            url: ApiRoute.Users.Root,
            method: 'GET',
            query,
        },
        {
            keepPreviousData: true,
        },
    );

export const useUpdateUser = (user: User) => {
    const queryClient = useQueryClient();

    return useGenericMutation<User, Partial<User>>(
        {
            url: `${ApiRoute.Users.Root}/${user._id}`,
            method: 'PATCH',
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries([ApiRoute.Users.Root]);
                queryClient.invalidateQueries([ApiRoute.Users.Me]);
            },
        },
    );
};

export const useUser = () =>
    useFetch<User>(
        {
            url: ApiRoute.Users.Me,
            method: 'GET',
        },
        {
            keepPreviousData: true,
        },
    );
