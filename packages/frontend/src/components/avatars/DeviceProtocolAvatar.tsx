import { DeviceProtocol } from '@definitions/entities/deviceTypes';
import { Box, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';

import VirtualDeviceAvatar from './VirtualDeviceAvatar';
import ZigbeeDeviceAvatar from './ZigbeeDeviceAvatar';

interface Props {
    protocol: DeviceProtocol;
}

export default function DeviceProtocolAvatar({ protocol }: Props) {
    const { t } = useTranslation();

    const title = t(`devices:protocol.${protocol}`);

    switch (protocol) {
        case DeviceProtocol.Zigbee:
            return (
                <Tooltip title={title}>
                    <Box>
                        <ZigbeeDeviceAvatar />
                    </Box>
                </Tooltip>
            );

        case DeviceProtocol.Virtual:
            return (
                <Tooltip title={title}>
                    <Box>
                        <VirtualDeviceAvatar />
                    </Box>
                </Tooltip>
            );
    }
}
