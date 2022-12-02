import type { GenericEntity } from '@definitions/commonTypes';
import type { SearchQuery } from '@definitions/searchTypes';
import { SEARCH_QUERY_FIELDS } from '@definitions/searchTypes';
import { omitQueryDefaults, parseQuery, serializeQuery } from '@utils/searchQuery';
import { pick } from 'lodash';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useSaveQueryInUrl<TEntity extends GenericEntity>(
    searchQuery: SearchQuery<TEntity>,
    defaultQuery: SearchQuery<TEntity>,
) {
    const [currentSearchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        setSearchParams(
            serializeQuery({
                ...parseQuery(currentSearchParams.toString()),
                ...pick(omitQueryDefaults(searchQuery, defaultQuery), SEARCH_QUERY_FIELDS),
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultQuery, searchQuery, setSearchParams]);
}
