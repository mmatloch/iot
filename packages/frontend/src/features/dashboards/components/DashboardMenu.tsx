import { useDeleteDashboard } from '@api/dashboardApi';
import ListItemButtonWithIcon from '@components/ListItemButtonWithIcon';
import { Dashboard } from '@definitions/entities/dashboardTypes';
import { Delete, Edit, Share } from '@mui/icons-material';
import { Menu, MenuItem } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, generatePath } from 'react-router-dom';

import { AppRoute } from '../../../constants';
import DashboardShareDialog from './DashboardShareDialog';

interface Props {
    dashboard: Dashboard;
    onClose: () => void;
    anchorEl: HTMLElement | null;
}

export default function DashboardMenu({ dashboard, onClose, anchorEl }: Props) {
    const { t } = useTranslation(['generic', 'dashboards']);
    const { mutateAsync } = useDeleteDashboard(dashboard);
    const { enqueueSnackbar } = useSnackbar();
    const [shareDialogState, setShareDialogState] = useState(false);

    const dashboardEditorLink = generatePath(AppRoute.Dashboards.Editor, { dashboardId: String(dashboard._id) });

    const isMenuOpen = Boolean(anchorEl);

    const handleDelete = async () => {
        try {
            await mutateAsync();
        } catch {
            enqueueSnackbar(t('dashboards:errors.failedToDeleteDashboard'), {
                variant: 'error',
            });
        }
    };

    const openShareDialog = () => {
        setShareDialogState(true);
    };

    const closeShareDialog = () => {
        setShareDialogState(false);
    };

    return (
        <>
            <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={onClose}>
                <MenuItem component={Link} to={dashboardEditorLink}>
                    <ListItemButtonWithIcon text={t('edit')} icon={<Edit />} />
                </MenuItem>

                <MenuItem onClick={handleDelete}>
                    <ListItemButtonWithIcon text={t('delete')} icon={<Delete />} />
                </MenuItem>

                <MenuItem onClick={openShareDialog}>
                    <ListItemButtonWithIcon text={t('share')} icon={<Share />} />
                </MenuItem>
            </Menu>

            <DashboardShareDialog dashboard={dashboard} onClose={closeShareDialog} isOpen={shareDialogState} />
        </>
    );
}
