import { UseQueryOptions, useQuery } from 'react-query';

import { RequestOptions, createHttpClient } from '../clients/httpClient';

export const useFetch = <TResponseBody>(
    requestOptions: RequestOptions,
    useQueryOptions?: UseQueryOptions<TResponseBody, Error>,
) => {
    const defaultQueryKey = requestOptions.url;

    const useQueryOptionsWithDefaults: UseQueryOptions<TResponseBody, Error> = {
        queryKey: defaultQueryKey,
        ...useQueryOptions,
        queryFn: async () => {
            const { body } = await createHttpClient().request<TResponseBody>(requestOptions);
            return body;
        },
    };

    return useQuery<TResponseBody, Error>(useQueryOptionsWithDefaults);
};
