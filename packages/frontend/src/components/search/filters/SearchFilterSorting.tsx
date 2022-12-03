import type { GenericEntity } from '@definitions/commonTypes';
import type { SearchQuery } from '@definitions/searchTypes';
import { SortValue } from '@definitions/searchTypes';
import type { SelectChangeEvent } from '@mui/material';
import { FormControl, InputLabel, ListItem, MenuItem, Select } from '@mui/material';
import get from 'lodash/get';
import set from 'lodash/set';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';

enum SortOption {
    Default = 0,
    OldestFirst,
    NewestFirst,
    RecentlyUpdated,
}

interface Props<TEntity extends GenericEntity, TSearchQuery extends SearchQuery<TEntity>> {
    searchQuery: TSearchQuery;
    setSearchQuery: (query: TSearchQuery) => void;
}

export default function SearchFilterSorting<TEntity extends GenericEntity, TSearchQuery extends SearchQuery<TEntity>>({
    setSearchQuery,
    searchQuery,
}: Props<TEntity, TSearchQuery>) {
    const { t } = useTranslation();
    const labelId = useId();

    const sortingMap = [
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

    const getSelectedSorting = (): SortOption | undefined => {
        if (!searchQuery.sort) {
            return SortOption.Default;
        }

        const sortingMapItem = sortingMap.find(({ path, value }) => get(searchQuery, path) === value);

        return sortingMapItem?.option || SortOption.Default;
    };

    const selectedSorting = getSelectedSorting();

    const onSortingChange = (event: SelectChangeEvent<SortOption>) => {
        const obj = {
            sort: {
                _createdAt: undefined,
                _updatedAt: undefined,
            },
        } as TSearchQuery;

        const sortingMapItem = sortingMap.find(({ option }) => option === event.target.value);

        if (sortingMapItem) {
            set(obj, sortingMapItem.path, sortingMapItem.value);
        }

        setSearchQuery(obj);
    };

    return (
        <ListItem>
            <FormControl sx={{ width: '100%', mt: 1 }}>
                <InputLabel id={labelId}>{t('generic:search.sorting.title')}</InputLabel>
                <Select
                    labelId={labelId}
                    onChange={onSortingChange}
                    value={selectedSorting}
                    label={t('generic:search.sorting.title')}
                >
                    <MenuItem value={SortOption.Default}>{t('generic:default')}</MenuItem>

                    {sortingMap.map((item, index) => (
                        <MenuItem value={item.option} key={index}>
                            {item.text}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </ListItem>
    );
}
