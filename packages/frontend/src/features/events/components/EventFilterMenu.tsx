import SearchFilterCheckbox, { CheckboxFilterMapItem } from '@components/search/filters/SearchFilterCheckbox';
import SearchFilterSorting from '@components/search/filters/SearchFilterSorting';
import { EventState, EventsSearchQuery } from '@definitions/entities/eventTypes';
import { Divider, ListSubheader, Menu, MenuList } from '@mui/material';
import { useTranslation } from 'react-i18next';

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
            text: t('generic:search.filtering.showOnlyActive'),
        },
        showOnlyUserCreated: {
            path: 'filters._createdBy.$exists',
            checkValue: true,
            uncheckValue: undefined,
            text: t('events:search.showOnlyUserCreated'),
        },
    };

    return (
        <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={onClose}>
            <MenuList sx={{ pt: 0 }}>
                <ListSubheader sx={{ bgcolor: 'transparent' }}>{t('generic:search.filtering.title')}</ListSubheader>

                <Divider />

                <SearchFilterCheckbox
                    searchQuery={searchQuery}
                    filterMap={checkboxFilterMap.showOnlyActive}
                    onFilterChange={onFilterChange}
                />
                <SearchFilterCheckbox
                    searchQuery={searchQuery}
                    filterMap={checkboxFilterMap.showOnlyUserCreated}
                    onFilterChange={onFilterChange}
                />

                <Divider />

                <SearchFilterSorting searchQuery={searchQuery} onFilterChange={onFilterChange} />
            </MenuList>
        </Menu>
    );
}
