import type { SearchFilterOperatorValue, SearchQuery } from '@definitions/searchTypes';
import { SetSearchQuery } from '@hooks/search/useSearchQuery';
import type { SelectChangeEvent } from '@mui/material';
import { FormControl, InputLabel, ListItem, MenuItem, Select } from '@mui/material';
import { cloneDeep } from 'lodash';
import get from 'lodash/get';
import set from 'lodash/set';
import { useId, useMemo } from 'react';

type SelectOption = string | number;

export interface SelectFilterMapItem {
    text: string;
    option: SelectOption;
    path?: string;
    value?: SearchFilterOperatorValue;
}

interface Props<TSearchQuery extends SearchQuery> {
    label: string;
    filterMap: SelectFilterMapItem[];

    searchQueryBase?: TSearchQuery;
    searchQuery: TSearchQuery;
    setSearchQuery: SetSearchQuery<TSearchQuery>;
}

export default function SearchFilterSelect<TSearchQuery extends SearchQuery>({
    setSearchQuery,
    searchQuery,
    filterMap,
    label,
    searchQueryBase = {} as TSearchQuery,
}: Props<TSearchQuery>) {
    const labelId = useId();

    const selectedOption = useMemo(() => {
        const defaultOption = filterMap.find(({ path }) => !path);

        const sortingMapItem = filterMap.find(({ path, value }) => {
            if (path && value) {
                return get(searchQuery, path) === value;
            }

            return false;
        });

        return sortingMapItem?.option ?? defaultOption?.option ?? '';
    }, [filterMap, searchQuery]);

    const onChange = (event: SelectChangeEvent<SelectOption>) => {
        const obj = cloneDeep(searchQueryBase);

        const mapItem = filterMap.find(({ option }) => option === event.target.value);

        if (mapItem?.path && mapItem?.value) {
            set(obj, mapItem.path, mapItem.value);
        }

        setSearchQuery(obj);
    };

    return (
        <ListItem>
            <FormControl sx={{ width: '100%', mt: 1 }}>
                <InputLabel id={labelId}>{label}</InputLabel>
                <Select labelId={labelId} onChange={onChange} value={selectedOption} label={label}>
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
