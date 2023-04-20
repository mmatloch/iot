import SearchFilterSorting from '@components/search/filters/SearchFilterSorting';
import { GenericEntity } from '@definitions/commonTypes';
import { SearchQuery } from '@definitions/searchTypes';
import { SetSearchQuery } from '@hooks/search/useSearchQuery';
import { FilterListOff } from '@mui/icons-material';
import { Divider, IconButton, ListSubheader, Menu, MenuList, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface Props<TEntity extends GenericEntity> {
    onClose: () => void;
    anchorEl: HTMLElement | null;
    children: ReactNode;

    setSearchQuery: SetSearchQuery<SearchQuery<TEntity>>;
    searchQuery: SearchQuery<TEntity>;
}

export default function SearchFilterMenu<TEntity extends GenericEntity>({
    onClose,
    anchorEl,
    children,
    setSearchQuery,
    searchQuery,
}: Props<TEntity>) {
    const { t } = useTranslation();
    const isMenuOpen = Boolean(anchorEl);

    const clearFilters = () => {
        setSearchQuery(undefined);
    };

    return (
        <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={onClose}>
            <MenuList sx={{ pt: 0, width: '350px' }}>
                <ListSubheader sx={{ bgcolor: 'transparent' }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} sx={{ mb: 1 }}>
                        <Typography>{t('generic:search.filtering.title')}</Typography>

                        <IconButton onClick={clearFilters}>
                            <FilterListOff />
                        </IconButton>
                    </Stack>
                </ListSubheader>

                <Divider />

                {children}

                <Divider />

                <SearchFilterSorting searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </MenuList>
        </Menu>
    );
}
