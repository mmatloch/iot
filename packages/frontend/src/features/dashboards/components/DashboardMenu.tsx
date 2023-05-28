import { useDeleteDashboard } from '@api/dashboardApi';
import ListItemButtonWithIcon from '@components/ListItemButtonWithIcon';
import { Dashboard } from '@definitions/entities/dashboardTypes';
import { Delete, Edit } from '@mui/icons-material';
import { Menu, MenuItem } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate } from 'react-router-dom';

import { AppRoute } from '../../../constants';

interface Props {
    dashboard: Dashboard;
    onClose: () => void;
    anchorEl: HTMLElement | null;
}

export default function DashboardMenu({ dashboard, onClose, anchorEl }: Props) {
    const { t } = useTranslation(['generic', 'dashboards']);
    const navigate = useNavigate();
    const { mutateAsync } = useDeleteDashboard(dashboard);
    const { enqueueSnackbar } = useSnackbar();

    const isMenuOpen = Boolean(anchorEl);

    const openDashboardEditor = () => {
        navigate(generatePath(AppRoute.Dashboards.Editor, { dashboardId: String(dashboard._id) }));
    };

    const handleDelete = async () => {
        try {
            await mutateAsync();
        } catch {
            enqueueSnackbar(t('dashboards:errors.failedToDeleteDashboard'), {
                variant: 'error',
            });
        }
    };

    return (
        <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={onClose}>
            <MenuItem onClick={openDashboardEditor}>
                <ListItemButtonWithIcon text={t('edit')} icon={<Edit />} />
            </MenuItem>

            <MenuItem onClick={handleDelete}>
                <ListItemButtonWithIcon text={t('delete')} icon={<Delete />} />
            </MenuItem>
        </Menu>
    );
}
