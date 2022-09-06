import { DeviceProtocol } from '@definitions/deviceTypes';
import { Box, Typography } from '@mui/material';

import DeviceProtocolList from '../DeviceProtocolList';

interface Props {
    onSelect: (protocol: DeviceProtocol) => void;
}

export default function SelectProtocolStepContent({ onSelect }: Props) {
    return (
        <Box>
            <Typography>The protocol defines how to communicate with the device</Typography>
            <Box sx={{ mt: 2 }}>
                <DeviceProtocolList onSelect={onSelect} />
            </Box>
        </Box>
    );
}
