import type { GenericEntity } from '@definitions/commonTypes';
import type { SearchQuery } from '@definitions/searchTypes';
import { mergeQuery } from '@utils/searchQuery';
import { useCallback, useState } from 'react';

import { useDefaultQuery } from './useDefaultQuery';
import { useQueryFromUrl } from './useQueryFromUrl';
import { useSaveQueryInUrl } from './useSaveQueryInUrl';

interface Props<TEntity extends GenericEntity> {
    defaultQuery?: SearchQuery<TEntity>;
    loadRelations?: boolean;
}

export type SetSearchQuery<TEntity extends GenericEntity> = (updatedQuery: SearchQuery<TEntity>) => void;

export function useSearchQuery<TEntity extends GenericEntity>({
    defaultQuery: defaultQueryOverrides,
    loadRelations,
}: Props<TEntity>) {
    const defaultQuery = useDefaultQuery(defaultQueryOverrides, loadRelations);
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
