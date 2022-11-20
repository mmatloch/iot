import { useUpdateDevice } from '@api/devicesApi';
import { Device, DeviceDeactivatedByType, DeviceState } from '@definitions/entities/deviceTypes';
import { Edit, PublishedWithChanges, ViewSidebar } from '@mui/icons-material';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { useSnackbar } from 'notistack';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { useDeviceDetails } from '../hooks/useDeviceDetails';

interface Props {
    device: Device;
    onClose: () => void;
    onEdit: () => void;
    anchorEl: HTMLElement | null;
}

interface ListItemButtonProps {
    text: string;
    icon: ReactNode;
}

const ListItemButton = ({ text, icon }: ListItemButtonProps) => {
    return (
        <>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText>{text}</ListItemText>
        </>
    );
};

export default function DeviceMenu({ device, onClose, onEdit, anchorEl }: Props) {
    const { t } = useTranslation();
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
                <ListItemButton text={t('generic:showDetails')} icon={<ViewSidebar />} />
            </MenuItem>
            <MenuItem onClick={onEdit}>
                <ListItemButton text={t('generic:edit')} icon={<Edit />} />
            </MenuItem>

            {canBeActivated && (
                <MenuItem onClick={changeState}>
                    <ListItemButton text={t(`generic:activate`)} icon={<PublishedWithChanges />} />
                </MenuItem>
            )}

            {canBeDeactivated && (
                <MenuItem onClick={changeState}>
                    <ListItemButton text={t(`generic:deactivate`)} icon={<PublishedWithChanges />} />
                </MenuItem>
            )}
        </Menu>
    );
}
