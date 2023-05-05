import { useUpdateDevice } from '@api/devicesApi';
import ListItemButtonWithIcon from '@components/ListItemButtonWithIcon';
import type { Device } from '@definitions/entities/deviceTypes';
import { DeviceDeactivatedByType, DeviceState } from '@definitions/entities/deviceTypes';
import { Edit, PublishedWithChanges, ViewSidebar } from '@mui/icons-material';
import { Menu, MenuItem } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

import { useDeviceDetails } from '../hooks/useDeviceDetails';

interface Props {
    device: Device;
    onClose: () => void;
    onEdit: () => void;
    anchorEl: HTMLElement | null;
}

export default function DeviceMenu({ device, onClose, onEdit, anchorEl }: Props) {
    const { t } = useTranslation(['generic', 'devices']);
    const { enqueueSnackbar } = useSnackbar();
    const { mutateAsync } = useUpdateDevice(device);
    const { openDeviceDetails } = useDeviceDetails();

    const isMenuOpen = Boolean(anchorEl);

    const isActive = device.state === DeviceState.Active;
    const canBeActivated =
        device.state === DeviceState.Inactive && device.deactivatedBy?.type === DeviceDeactivatedByType.User;
    const canBeDeactivated = device.state === DeviceState.Active;

    const changeState = async () => {
        const newState = isActive ? DeviceState.Inactive : DeviceState.Active;

        try {
            await mutateAsync({
                state: newState,
            });
        } catch {
            enqueueSnackbar(t('devices:errors.failedToUpdateDevice'), {
                variant: 'error',
            });
        }

        onClose();
    };

    const openDetails = () => {
        openDeviceDetails(device._id);
        onClose();
    };

    return (
        <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={onClose}>
            <MenuItem onClick={openDetails}>
                <ListItemButtonWithIcon text={t('generic:showDetails')} icon={<ViewSidebar />} />
            </MenuItem>
            <MenuItem onClick={onEdit}>
                <ListItemButtonWithIcon text={t('generic:edit')} icon={<Edit />} />
            </MenuItem>

            {canBeActivated && (
                <MenuItem onClick={changeState}>
                    <ListItemButtonWithIcon text={t(`generic:activate`)} icon={<PublishedWithChanges />} />
                </MenuItem>
            )}

            {canBeDeactivated && (
                <MenuItem onClick={changeState}>
                    <ListItemButtonWithIcon text={t(`generic:deactivate`)} icon={<PublishedWithChanges />} />
                </MenuItem>
            )}
        </Menu>
    );
}
