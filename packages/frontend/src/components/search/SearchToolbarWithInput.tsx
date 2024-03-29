import type { GenericEntity } from '@definitions/commonTypes';
import type { SearchQuery } from '@definitions/searchTypes';
import type { SetSearchQuery } from '@hooks/search/useSearchQuery';
import { Add, FilterList } from '@mui/icons-material';
import { Box, Button, Toolbar, Typography } from '@mui/material';
import type { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

import SearchTextInput from './SearchTextInput';

interface Props<TEntity extends GenericEntity> {
    title: string;
    onFiltersClick: (event: MouseEvent<HTMLButtonElement>) => void;
    onCreateClick?: (event: MouseEvent<HTMLButtonElement>) => void;

    searchLabel: string;
    searchField: keyof TEntity;
    setSearchQuery: SetSearchQuery<SearchQuery<TEntity>>;
    searchQuery: SearchQuery<TEntity>;
}

export default function SearchToolbarWithInput<TEntity extends GenericEntity>({
    title,
    onCreateClick,
    onFiltersClick,

    searchLabel,
    searchField,
    setSearchQuery,
    searchQuery,
}: Props<TEntity>) {
    const { t } = useTranslation();

    return (
        <Toolbar
            sx={{
                mb: 3,
                flexDirection: {
                    xs: 'column',
                    sm: 'row',
                },
                alignItems: {
                    xs: 'start',
                    sm: 'center',
                },
            }}
        >
            <Typography sx={{ typography: { sm: 'h4', xs: 'h5' }, flexGrow: 1 }} component="div">
                {title}
            </Typography>

            <SearchTextInput
                label={searchLabel}
                sx={{ mt: 1, mr: 1 }}
                setSearchQuery={setSearchQuery}
                searchQuery={searchQuery}
                searchField={searchField}
            />

            <Box sx={{ mt: 1 }}>
                {onCreateClick ? (
                    <Button size="large" onClick={onCreateClick} endIcon={<Add fontSize="inherit" />}>
                        {t('create')}
                    </Button>
                ) : null}

                <Button size="large" onClick={onFiltersClick} endIcon={<FilterList fontSize="inherit" />}>
                    {t('search.filters')}
                </Button>
            </Box>
        </Toolbar>
    );
}
