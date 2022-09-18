import { EventState, EventsSearchQuery } from '@definitions/eventTypes';
import { SortValue } from '@definitions/searchTypes';
import { Divider, ListSubheader, Menu, MenuList } from '@mui/material';
import { useTranslation } from 'react-i18next';

import EventFilterMenuCheckbox, { CheckboxFilterMapItem } from './FilterMenu/EventFilterMenuCheckbox';
import EventFilterMenuSelect from './FilterMenu/EventFilterMenuSelect';

enum SortOption {
    Default = 0,
    OldestFirst,
    NewestFirst,
    RecentlyUpdated,
}

interface Props {
    onClose: () => void;
    onFilterChange: (query: EventsSearchQuery) => void;
    searchQuery: EventsSearchQuery;
    anchorEl: HTMLElement | null;
}

export default function EventFilterMenu({ onClose, anchorEl, onFilterChange, searchQuery }: Props) {
    const { t } = useTranslation();

    const isMenuOpen = Boolean(anchorEl);

    const checkboxFilterMap: Record<string, CheckboxFilterMapItem> = {
        showOnlyActive: {
            path: 'filters.state',
            checkValue: EventState.Active,
            uncheckValue: undefined,
            text: t('events:search.showOnlyActive'),
        },
        showOnlyUserCreated: {
            path: 'filters._createdBy.$exists',
            checkValue: true,
            uncheckValue: undefined,
            text: t('events:search.showOnlyUserCreated'),
        },
    };

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

    return (
        <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={onClose}>
            <MenuList sx={{ pt: 0 }}>
                <ListSubheader sx={{ bgcolor: 'transparent' }}>{t('generic:search.filtering')}</ListSubheader>

                <Divider />

                <EventFilterMenuCheckbox
                    searchQuery={searchQuery}
                    filterMap={checkboxFilterMap.showOnlyActive}
                    onFilterChange={onFilterChange}
                />
                <EventFilterMenuCheckbox
                    searchQuery={searchQuery}
                    filterMap={checkboxFilterMap.showOnlyUserCreated}
                    onFilterChange={onFilterChange}
                />

                <Divider />

                <EventFilterMenuSelect
                    label={t('generic:search.sorting.title')}
                    searchQuery={searchQuery}
                    onFilterChange={onFilterChange}
                    defaultOption={SortOption.Default}
                    filterMap={sortingMap}
                />
            </MenuList>
        </Menu>
    );
}
