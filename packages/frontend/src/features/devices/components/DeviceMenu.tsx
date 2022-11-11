import { useUpdateDevice } from '@api/devicesApi';
import { Device, DeviceState } from '@definitions/entities/deviceTypes';
import { Edit, Preview, PublishedWithChanges } from '@mui/icons-material';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { useSnackbar } from 'notistack';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate } from 'react-router-dom';

import { AppRoute } from '../../../constants';

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
    const navigate = useNavigate();

    const isMenuOpen = Boolean(anchorEl);

    const isActive = device.state === DeviceState.Active;
    const isInactive = device.state === DeviceState.Inactive;

    const changeState = async () => {
        const newState = isInactive ? DeviceState.Active : DeviceState.Inactive;

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

    const openEventEditor = () => {
        navigate(generatePath(AppRoute.Devices.Editor, { deviceId: String(device._id) }));
    };

    return (
        <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={onClose}>
            <MenuItem onClick={openEventEditor}>
                <ListItemButton text={t('devices:editor.openInEditor')} icon={<Preview />} />
            </MenuItem>
            <MenuItem onClick={onEdit}>
                <ListItemButton text={t('generic:edit')} icon={<Edit />} />
            </MenuItem>

            {isInactive && (
                <MenuItem onClick={changeState}>
                    <ListItemButton text={t(`generic:activate`)} icon={<PublishedWithChanges />} />
                </MenuItem>
            )}

            {isActive && (
                <MenuItem onClick={changeState}>
                    <ListItemButton text={t(`generic:deactivate`)} icon={<PublishedWithChanges />} />
                </MenuItem>
            )}
        </Menu>
    );
}
