import { Widget } from '@definitions/entities/widgetTypes';
import { ListSubheader, Menu, MenuList, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import WidgetAutocomplete from './WidgetAutocomplete';

interface Props {
    onClose: () => void;
    anchorEl: HTMLElement | null;
}

export const SelectWidgetMenu = ({ onClose, anchorEl }: Props) => {
    const { t } = useTranslation();

    const isMenuOpen = Boolean(anchorEl);

    const handleWidgetSelect = (_: unknown, selectedWidget: Widget | null) => {
        console.log(selectedWidget);
    };

    return (
        <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={onClose}>
            <ListSubheader sx={{ bgcolor: 'transparent' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} sx={{ mb: 1 }}>
                    <Typography>{t('dashboards:creator.addWidget')}</Typography>
                </Stack>
            </ListSubheader>

            <MenuList sx={{ mx: 3, width: '350px' }}>
                <WidgetAutocomplete
                    onChange={handleWidgetSelect}
                    InputProps={{ label: t('generic:search.filtering.filterByWidget') }}
                />
            </MenuList>
        </Menu>
    );
};
