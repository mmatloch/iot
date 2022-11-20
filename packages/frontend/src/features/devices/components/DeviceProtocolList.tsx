import VirtualDeviceAvatar from '@components/avatars/VirtualDeviceAvatar';
import ZigbeeDeviceAvatar from '@components/avatars/ZigbeeDeviceAvatar';
import { DeviceProtocol } from '@definitions/entities/deviceTypes';
import { List, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
    onSelect: (protocol: DeviceProtocol) => void;
}

export default function DeviceProtocolList({ onSelect }: Props) {
    const { t } = useTranslation();

    return (
        <List>
            <ListItemButton onClick={() => onSelect(DeviceProtocol.Zigbee)}>
                <ListItemAvatar>
                    <ZigbeeDeviceAvatar />
                </ListItemAvatar>
                <ListItemText primary={t(`devices:protocol.${DeviceProtocol.Zigbee}`)} />
            </ListItemButton>
            <ListItemButton onClick={() => onSelect(DeviceProtocol.Virtual)}>
                <ListItemAvatar>
                    <VirtualDeviceAvatar />
                </ListItemAvatar>
                <ListItemText primary={t(`devices:protocol.${DeviceProtocol.Virtual}`)} />
            </ListItemButton>
        </List>
    );
}
