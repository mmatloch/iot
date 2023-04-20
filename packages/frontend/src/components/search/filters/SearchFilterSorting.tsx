import type { SearchQuery } from '@definitions/searchTypes';
import { SortValue } from '@definitions/searchTypes';
import { SetSearchQuery } from '@hooks/search/useSearchQuery';
import { useTranslation } from 'react-i18next';

import SearchFilterSelect from './SearchFilterSelect';

enum SortOption {
    Default = 0,
    OldestFirst,
    NewestFirst,
    RecentlyUpdated,
}

const SEARCH_QUERY_BASE = {
    sort: {
        _createdAt: undefined,
        _updatedAt: undefined,
    },
};

interface Props<TSearchQuery extends SearchQuery> {
    searchQuery: TSearchQuery;
    setSearchQuery: SetSearchQuery<TSearchQuery>;
}

export default function SearchFilterSorting<TSearchQuery extends SearchQuery>({
    setSearchQuery,
    searchQuery,
}: Props<TSearchQuery>) {
    const { t } = useTranslation();

    const sortingMap = [
        {
            option: SortOption.Default,
            text: t('generic:default'),
        },
        {
            path: 'sort._createdAt',
            value: SortValue.Desc,
            option: SortOption.OldestFirst,
            text: t('generic:search.sorting.oldestFirst'),
        },
        {
            path: 'sort._createdAt',
            value: SortValue.Asc,
            option: SortOption.NewestFirst,
            text: t('generic:search.sorting.newestFirst'),
        },
        {
            path: 'sort._updatedAt',
            value: SortValue.Desc,
            option: SortOption.RecentlyUpdated,
            text: t('generic:search.sorting.recentlyUpdated'),
        },
    ];

    return (
        <SearchFilterSelect
            label={t('generic:search.sorting.title')}
            searchQueryBase={SEARCH_QUERY_BASE as TSearchQuery}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterMap={sortingMap}
        />
    );
}
