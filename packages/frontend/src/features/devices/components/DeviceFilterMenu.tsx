import type { CheckboxFilterMapItem } from '@components/search/filters/SearchFilterCheckbox';
import SearchFilterCheckbox from '@components/search/filters/SearchFilterCheckbox';
import SearchFilterSorting from '@components/search/filters/SearchFilterSorting';
import type { DevicesSearchQuery } from '@definitions/entities/deviceTypes';
import { DeviceState } from '@definitions/entities/deviceTypes';
import { Divider, ListSubheader, Menu, MenuList } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
    onClose: () => void;
    onFilterChange: (query: DevicesSearchQuery) => void;
    searchQuery: DevicesSearchQuery;
    anchorEl: HTMLElement | null;
}

export default function DeviceFilterMenu({ onClose, anchorEl, onFilterChange, searchQuery }: Props) {
    const { t } = useTranslation();

    const isMenuOpen = Boolean(anchorEl);

    const checkboxFilterMap: Record<string, CheckboxFilterMapItem> = {
        showOnlyActive: {
            path: 'filters.state',
            checkValue: DeviceState.Active,
            uncheckValue: undefined,
            text: t('generic:search.filtering.showOnlyActive'),
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

                <Divider />

                <SearchFilterSorting searchQuery={searchQuery} onFilterChange={onFilterChange} />
            </MenuList>
        </Menu>
    );
}
