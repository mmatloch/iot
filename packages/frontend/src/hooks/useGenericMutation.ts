import type { RequestOptions} from '@clients/httpClient';
import { createHttpClient } from '@clients/httpClient';
import type { UseMutationOptions} from 'react-query';
import { useMutation } from 'react-query';

type DefaultVariables = Record<string, unknown>;

export const useGenericMutation = <TResponseBody, TVariables = DefaultVariables>(
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
