import { EventsSearchQuery } from '@definitions/entities/eventTypes';
import { FormControl, InputLabel, ListItem, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import get from 'lodash/get';
import set from 'lodash/set';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';

interface SelectFilterMapItem<TSortOption> {
    path: string;
    value: string;
    text: string;
    option: TSortOption;
}

interface Props<TSortOption> {
    searchQuery: EventsSearchQuery;
    label: string;
    filterMap: SelectFilterMapItem<TSortOption>[];
    onFilterChange: (query: EventsSearchQuery) => void;
    defaultOption: TSortOption;
}

export default function EventFilterMenuSelect<TSortOption extends number>({
    label,
    onFilterChange,
    searchQuery,
    defaultOption,
    filterMap,
}: Props<TSortOption>) {
    const { t } = useTranslation();
    const labelId = useId();

    const getSelectedSorting = (): TSortOption | undefined => {
        if (!searchQuery.sort) {
            return defaultOption;
        }

        const sortingMapItem = filterMap.find(({ path, value }) => get(searchQuery, path) === value);

        return sortingMapItem?.option || defaultOption;
    };

    const selectedSorting = getSelectedSorting();

    const onSortingChange = (event: SelectChangeEvent<TSortOption>) => {
        const obj = {
            sort: {
                _createdAt: undefined,
                _updatedAt: undefined,
            },
        };

        const sortingMapItem = filterMap.find(({ option }) => option === event.target.value);

        if (sortingMapItem) {
            set(obj, sortingMapItem.path, sortingMapItem.value);
        }

        onFilterChange(obj);
    };

    return (
        <ListItem>
            <FormControl sx={{ width: '100%', mt: 1 }}>
                <InputLabel id={labelId}>{label}</InputLabel>
                <Select labelId={labelId} onChange={onSortingChange} value={selectedSorting} label={label}>
                    <MenuItem value={defaultOption}>{t('generic:default')}</MenuItem>

                    {filterMap.map((item, index) => (
                        <MenuItem value={item.option} key={index}>
                            {item.text}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </ListItem>
    );
}
