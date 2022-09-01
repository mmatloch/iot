import { RequestOptions, createHttpClient } from '@clients/httpClient';
import { UseMutationOptions, useMutation } from 'react-query';

export const useGenericMutation = <TResponseBody, TVariables extends Record<string, unknown>>(
    requestOptions: RequestOptions,
    useMutationOptions?: UseMutationOptions<TResponseBody, Error, TVariables>,
) => {
    const opts: UseMutationOptions<TResponseBody, Error, TVariables> = {
        mutationFn: async (variables) => {
            const { body } = await createHttpClient().request<TResponseBody>({
                ...requestOptions,
                body: variables,
            });
            return body;
        },
        ...useMutationOptions,
    };

    return useMutation<TResponseBody, Error, TVariables>(opts);
};
