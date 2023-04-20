import type { GenericEntity } from '@definitions/commonTypes';
import type { SearchQuery } from '@definitions/searchTypes';
import { serializeQuery } from '@utils/searchQuery';
import type { UseQueryOptions} from 'react-query';
import { useQuery } from 'react-query';

import type { RequestOptions} from '../clients/httpClient';
import { createHttpClient } from '../clients/httpClient';

interface UseFetchRequestOptions<TSearchQuery> extends RequestOptions {
    query?: TSearchQuery;
}

export const useFetch = <TResponseBody, TSearchQuery = SearchQuery<GenericEntity>>(
    useFetchRequestOptions: UseFetchRequestOptions<TSearchQuery>,
    useQueryOptions?: UseQueryOptions<TResponseBody, Error>,
) => {
    let url = useFetchRequestOptions.url;

    const defaultQueryKey = [url];

    if (useFetchRequestOptions.query) {
        const query = serializeQuery(useFetchRequestOptions.query);
        url = `${url}?${query}`;

        defaultQueryKey.push(query);
    }

    const requestOptions = {
        ...useFetchRequestOptions,
        url: url.toString(),
    };

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
