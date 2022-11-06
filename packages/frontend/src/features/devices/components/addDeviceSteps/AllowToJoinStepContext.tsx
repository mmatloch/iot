import AllowDevicesToJoinButton from '@components/configurations/AllowDevicesToJoinButton';
import { Configuration } from '@definitions/entities/configurationTypes';
import { Box, Typography } from '@mui/material';

interface Props {
    configuration: Configuration;
    onSuccess: () => void;
}

export default function AllowToJoinStepContext({ configuration, onSuccess }: Props) {
    return (
        <Box>
            <Typography>To allow devices to join the network joining has to be permitted.</Typography>
            <Box sx={{ mt: 4 }}></Box>

            <Typography color="error" fontWeight="bold">
                Do you want to allow devices to join?
            </Typography>
            <Typography color="error" fontStyle="italic">
                This option will turn off after 5 minutes
            </Typography>

            <Box sx={{ mt: 4 }}></Box>

            <AllowDevicesToJoinButton configuration={configuration} onSuccess={onSuccess}>
                Allow
            </AllowDevicesToJoinButton>
        </Box>
    );
}
