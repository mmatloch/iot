import ZigbeeLogo from '@assets/zigbeeLogo.png';
import { DeviceProtocol } from '@definitions/entities/deviceTypes';
import { DeviceUnknown } from '@mui/icons-material';
import { Avatar, List, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
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
                    <Avatar src={ZigbeeLogo} />
                </ListItemAvatar>
                <ListItemText primary={t(`devices:protocol.${DeviceProtocol.Zigbee}`)} />
            </ListItemButton>
            <ListItemButton onClick={() => onSelect(DeviceProtocol.Virtual)}>
                <ListItemAvatar>
                    <Avatar>
                        <DeviceUnknown />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t(`devices:protocol.${DeviceProtocol.Virtual}`)} />
            </ListItemButton>
        </List>
    );
}
