import type { SearchQuery } from '@definitions/searchTypes';
import { mergeQuery } from '@utils/searchQuery';
import { isUndefined } from 'lodash';
import { useCallback, useState } from 'react';

import { UseDefaultQueryOptions, useDefaultQuery } from './useDefaultQuery';
import { useQueryFromUrl } from './useQueryFromUrl';
import { useSaveQueryInUrl } from './useSaveQueryInUrl';

interface Props<TSearchQuery extends SearchQuery> extends UseDefaultQueryOptions {
    defaultQuery?: TSearchQuery;
}

export type SetSearchQuery<TSearchQuery extends SearchQuery> = (updatedQuery: TSearchQuery | undefined) => void;

export function useSearchQuery<TSearchQuery extends SearchQuery>({
    defaultQuery: defaultQueryOverrides,
    ...defaultQueryOptions
}: Props<TSearchQuery>) {
    const defaultQuery = useDefaultQuery(defaultQueryOverrides, defaultQueryOptions);
    const queryFromUrl = useQueryFromUrl<TSearchQuery>();

    const [searchQuery, setSearchQuery] = useState<TSearchQuery>(() => mergeQuery(defaultQuery, queryFromUrl));

    useSaveQueryInUrl(searchQuery, defaultQuery);

    const setSearchQueryWithMerge = useCallback(
        (updatedQuery: TSearchQuery | undefined) => {
            if (isUndefined(updatedQuery)) {
                setSearchQuery(defaultQuery);
            } else {
                setSearchQuery((currentSearchQuery) => mergeQuery(currentSearchQuery, { page: 1, ...updatedQuery }));
            }
        },
        [defaultQuery],
    );

    return {
        searchQuery,
        setSearchQuery: setSearchQueryWithMerge,
    };
}
