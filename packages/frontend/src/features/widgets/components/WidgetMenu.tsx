import { useDeleteWidget } from '@api/widgetsApi';
import ListItemButtonWithIcon from '@components/ListItemButtonWithIcon';
import { Widget } from '@definitions/entities/widgetTypes';
import { Delete, Edit } from '@mui/icons-material';
import { Menu, MenuItem } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate } from 'react-router-dom';

import { AppRoute } from '../../../constants';

interface Props {
    widget: Widget;
    onClose: () => void;
    anchorEl: HTMLElement | null;
}

export default function WidgetMenu({ widget, onClose, anchorEl }: Props) {
    const { t } = useTranslation(['generic', 'widgets']);
    const navigate = useNavigate();
    const { mutateAsync } = useDeleteWidget(widget);
    const { enqueueSnackbar } = useSnackbar();

    const isMenuOpen = Boolean(anchorEl);

    const openWidgetEditor = () => {
        navigate(generatePath(AppRoute.Widgets.Editor, { widgetId: String(widget._id) }));
    };

    const handleDelete = async () => {
        try {
            await mutateAsync();
        } catch {
            enqueueSnackbar(t('widgets:errors.failedToDeleteWidget'), {
                variant: 'error',
            });
        }
    };

    return (
        <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={onClose}>
            <MenuItem onClick={openWidgetEditor}>
                <ListItemButtonWithIcon text={t('edit')} icon={<Edit />} />
            </MenuItem>

            <MenuItem onClick={handleDelete}>
                <ListItemButtonWithIcon text={t('delete')} icon={<Delete />} />
            </MenuItem>
        </Menu>
    );
}
