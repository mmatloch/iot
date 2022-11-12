import { GenericEntity } from '@definitions/commonTypes';
import { SearchQuery } from '@definitions/searchTypes';
import { useMediaQuery, useTheme } from '@mui/material';
import { mergeQuery } from '@utils/searchQuery';
import { defaults } from 'lodash';
import { useCallback, useState } from 'react';

interface Props<TEntity extends GenericEntity> {
    defaultQuery?: SearchQuery<TEntity>;
}

export type SetSearchQuery<TEntity extends GenericEntity> = (updatedQuery: SearchQuery<TEntity>) => void;

const useDefaultSize = () => {
    const theme = useTheme();

    const isLargeMedia = useMediaQuery(theme.breakpoints.up('lg'));

    if (isLargeMedia) {
        return 9;
    }

    return 10;
};

export function useSearchQuery<TEntity extends GenericEntity>({ defaultQuery: defaultQueryOverrides }: Props<TEntity>) {
    const defaultSize = useDefaultSize();

    const defaultQuery = {
        relations: {
            _createdByUser: true,
            _updatedByUser: true,
        },
        page: 1,
        size: defaultSize,
    };

    const defaultQueryWithDefaults = defaults(defaultQueryOverrides, defaultQuery);

    const [searchQuery, setSearchQuery] = useState<SearchQuery<TEntity>>(defaultQueryWithDefaults);

    const setSearchQueryWithMerge = useCallback(
        (updatedQuery: SearchQuery<TEntity>) =>
            setSearchQuery((currentSearchQuery) => mergeQuery(currentSearchQuery, updatedQuery)),
        [],
    );

    return {
        searchQuery,
        setSearchQuery: setSearchQueryWithMerge,
    };
}
