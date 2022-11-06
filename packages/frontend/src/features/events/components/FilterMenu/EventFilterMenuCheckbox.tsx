import { EventsSearchQuery } from '@definitions/entities/eventTypes';
import { Checkbox, ListItem, ListItemButton, ListItemText } from '@mui/material';
import get from 'lodash/get';
import set from 'lodash/set';
import { ChangeEvent } from 'react';

export interface CheckboxFilterMapItem {
    path: string;
    checkValue: unknown;
    uncheckValue: unknown;
    text: string;
}

interface Props {
    searchQuery: EventsSearchQuery;
    filterMap: CheckboxFilterMapItem;
    onFilterChange: (query: EventsSearchQuery) => void;
}

export default function EventFilterMenuCheckbox({ filterMap, searchQuery, onFilterChange }: Props) {
    const isChecked = get(searchQuery, filterMap.path) === filterMap.checkValue;

    const onListClick = () => {
        const obj = {};

        if (isChecked) {
            set(obj, filterMap.path, filterMap.uncheckValue);
        } else {
            set(obj, filterMap.path, filterMap.checkValue);
        }

        onFilterChange(obj);
    };

    const onCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        const obj = {};

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
