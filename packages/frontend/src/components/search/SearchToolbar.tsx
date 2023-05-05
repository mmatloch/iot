import { Add, FilterList } from '@mui/icons-material';
import { Box, Button, Toolbar, Typography } from '@mui/material';
import type { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    title: string;
    onFiltersClick: (event: MouseEvent<HTMLButtonElement>) => void;
    onCreateClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export default function SearchToolbar({ title, onCreateClick, onFiltersClick }: Props) {
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
