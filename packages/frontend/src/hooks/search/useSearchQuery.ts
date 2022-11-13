import { GenericEntity } from '@definitions/commonTypes';
import { SearchQuery } from '@definitions/searchTypes';
import { mergeQuery } from '@utils/searchQuery';
import { useCallback, useState } from 'react';

import { useDefaultQuery } from './useDefaultQuery';
import { useQueryFromUrl } from './useQueryFromUrl';
import { useSaveQueryInUrl } from './useSaveQueryInUrl';

interface Props<TEntity extends GenericEntity> {
    defaultQuery?: SearchQuery<TEntity>;
}

export type SetSearchQuery<TEntity extends GenericEntity> = (updatedQuery: SearchQuery<TEntity>) => void;

export function useSearchQuery<TEntity extends GenericEntity>({ defaultQuery: defaultQueryOverrides }: Props<TEntity>) {
    const defaultQuery = useDefaultQuery(defaultQueryOverrides);
    const queryFromUrl = useQueryFromUrl();

    const [searchQuery, setSearchQuery] = useState<SearchQuery<TEntity>>(() => mergeQuery(defaultQuery, queryFromUrl));

    useSaveQueryInUrl(searchQuery, defaultQuery);

    const setSearchQueryWithMerge = useCallback((updatedQuery: SearchQuery<TEntity>) => {
        setSearchQuery((currentSearchQuery) => mergeQuery(currentSearchQuery, { page: 1, ...updatedQuery }));
    }, []);

    return {
        searchQuery,
        setSearchQuery: setSearchQueryWithMerge,
    };
}
