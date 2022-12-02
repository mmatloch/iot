import type { GenericEntity } from '@definitions/commonTypes';
import type { SearchQuery } from '@definitions/searchTypes';
import { Checkbox, ListItem, ListItemButton, ListItemText } from '@mui/material';
import get from 'lodash/get';
import set from 'lodash/set';
import type { ChangeEvent } from 'react';

export interface CheckboxFilterMapItem {
    path: string;
    checkValue: unknown;
    uncheckValue: unknown;
    text: string;
}

interface Props<TEntity extends GenericEntity, TSearchQuery extends SearchQuery<TEntity>> {
    filterMap: CheckboxFilterMapItem;

    searchQuery: TSearchQuery;
    onFilterChange: (query: TSearchQuery) => void;
}

export default function SearchFilterCheckbox<TEntity extends GenericEntity, TSearchQuery extends SearchQuery<TEntity>>({
    filterMap,
    searchQuery,
    onFilterChange,
}: Props<TEntity, TSearchQuery>) {
    const isChecked = get(searchQuery, filterMap.path) === filterMap.checkValue;

    const onListClick = () => {
        const obj = {} as TSearchQuery;

        if (isChecked) {
            set(obj, filterMap.path, filterMap.uncheckValue);
        } else {
            set(obj, filterMap.path, filterMap.checkValue);
        }

        onFilterChange(obj);
    };

    const onCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        const obj = {} as TSearchQuery;

        if (event.target.checked) {
            set(obj, filterMap.path, filterMap.checkValue);
        } else {
            set(obj, filterMap.path, filterMap.uncheckValue);
        }

        onFilterChange(obj);
    };

    return (
        <ListItem
            secondaryAction={<Checkbox edge="end" checked={isChecked} onChange={onCheckboxChange} />}
            disablePadding
            onClick={onListClick}
        >
            <ListItemButton>
                <ListItemText>{filterMap.text}</ListItemText>
            </ListItemButton>
        </ListItem>
    );
}
