import ZigbeeLogo from '@assets/zigbeeLogo.png';
import { DeviceProtocol } from '@definitions/deviceTypes';
import { DeviceUnknown } from '@mui/icons-material';
import { Avatar, List, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';

interface Props {
    onSelect: (protocol: DeviceProtocol) => void;
}

export default function DeviceProtocolList({ onSelect }: Props) {
    return (
        <List>
            <ListItemButton onClick={() => onSelect(DeviceProtocol.Zigbee)}>
                <ListItemAvatar>
                    <Avatar src={ZigbeeLogo} />
                </ListItemAvatar>
                <ListItemText primary="ZigBee" />
            </ListItemButton>
            <ListItemButton onClick={() => onSelect(DeviceProtocol.Virtual)}>
                <ListItemAvatar>
                    <Avatar>
                        <DeviceUnknown />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Virtual device" />
            </ListItemButton>
        </List>
    );
}
