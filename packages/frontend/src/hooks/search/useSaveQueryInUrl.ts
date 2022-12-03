import type { SearchQuery } from '@definitions/searchTypes';
import { SEARCH_QUERY_FIELDS } from '@definitions/searchTypes';
import { omitQueryDefaults, parseQuery, serializeQuery } from '@utils/searchQuery';
import { omit, pick } from 'lodash';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useSaveQueryInUrl<TSearchQuery extends SearchQuery>(
    searchQuery: TSearchQuery,
    defaultQuery: TSearchQuery,
) {
    const [currentSearchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        setSearchParams(
            serializeQuery({
                ...omit(parseQuery(currentSearchParams.toString()), SEARCH_QUERY_FIELDS),
                ...pick(omitQueryDefaults(searchQuery, defaultQuery), SEARCH_QUERY_FIELDS),
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultQuery, searchQuery, setSearchParams]);
}
