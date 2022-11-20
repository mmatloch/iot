import { UsersSearchQuery } from '@api/usersApi';
import SearchFilterCheckbox, { CheckboxFilterMapItem } from '@components/search/filters/SearchFilterCheckbox';
import SearchFilterSorting from '@components/search/filters/SearchFilterSorting';
import { UserState } from '@definitions/entities/userTypes';
import { Divider, ListSubheader, Menu, MenuList } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
    onClose: () => void;
    onFilterChange: (query: UsersSearchQuery) => void;
    searchQuery: UsersSearchQuery;
    anchorEl: HTMLElement | null;
}

export default function UserFilterMenu({ onClose, anchorEl, onFilterChange, searchQuery }: Props) {
    const { t } = useTranslation();

    const isMenuOpen = Boolean(anchorEl);

    const checkboxFilterMap: Record<string, CheckboxFilterMapItem> = {
        showOnlyActive: {
            path: 'filters.state',
            checkValue: UserState.Active,
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
