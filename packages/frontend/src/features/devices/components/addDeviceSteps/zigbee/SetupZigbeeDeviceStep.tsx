import { Device } from '@definitions/entities/deviceTypes';
import { useDeviceDetails } from '@features/devices/hooks/useDeviceDetails';
import { Alert, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
    device: Device;
}

export default function SetupZigbeeDeviceStep({ device }: Props) {
    const { t } = useTranslation();
    const { navigateAndOpenDeviceDetails } = useDeviceDetails();

    const onClick = () => {
        navigateAndOpenDeviceDetails(device._id);
    };

    return (
        <>
            <Alert severity="success" sx={{ mt: 1 }}>
                {t('devices:creator.deviceSetup.deviceAdded')}
            </Alert>
            <Button sx={{ mt: 3 }} variant="contained" onClick={onClick}>
                {t('devices:creator.deviceSetup.goToDeviceConfiguration')}
            </Button>
        </>
    );
}
