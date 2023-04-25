import { Add, FilterList, Save } from '@mui/icons-material';
import { Box, Button, Toolbar, Typography } from '@mui/material';
import type { MouseEvent, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    title: string;
    onFiltersClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    onCreateClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    onSaveClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    buttons?: ReactNode;
}

export const ActionToolbar = ({ title, buttons, onCreateClick, onFiltersClick, onSaveClick }: Props) => {
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
                {onCreateClick && (
                    <Button size="large" onClick={onCreateClick} endIcon={<Add fontSize="inherit" />}>
                        {t('generic:create')}
                    </Button>
                )}

                {onFiltersClick && (
                    <Button size="large" onClick={onFiltersClick} endIcon={<FilterList fontSize="inherit" />}>
                        {t('generic:search.filters')}
                    </Button>
                )}

                {onSaveClick && (
                    <Button size="large" onClick={onSaveClick} endIcon={<Save fontSize="inherit" />}>
                        {t('generic:save')}
                    </Button>
                )}

                {buttons}
            </Box>
        </Toolbar>
    );
};
