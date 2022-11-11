import { Add, FilterList } from '@mui/icons-material';
import { Box, Button, TextField, Toolbar, Typography } from '@mui/material';
import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    title: string;
    searchLabel: string;
    onFiltersClick: (event: MouseEvent<HTMLButtonElement>) => void;
    onCreateClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    onSearchChange: (value: string) => void;
}

export default function SearchToolbar({ title, searchLabel, onSearchChange, onCreateClick, onFiltersClick }: Props) {
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

            <TextField
                label={searchLabel}
                sx={{ mt: 1, mr: 1 }}
                onChange={(event) => onSearchChange(event.target.value)}
            />

            <Box>
                {onCreateClick ? (
                    <Button size="large" onClick={onCreateClick} endIcon={<Add fontSize="inherit" />}>
                        {t('generic:create')}
                    </Button>
                ) : null}

                <Button size="large" onClick={onFiltersClick} endIcon={<FilterList fontSize="inherit" />}>
                    {t('generic:search.filters')}
                </Button>
            </Box>
        </Toolbar>
    );
}
