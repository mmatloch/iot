import { Device } from '@definitions/entities/deviceTypes';
import { Alert, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate } from 'react-router-dom';

import { AppRoute } from '../../../../../constants';

interface Props {
    device: Device;
}

export default function SetupZigbeeDeviceStep({ device }: Props) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const onClick = () => {
        navigate(generatePath(AppRoute.Devices.Editor, { deviceId: String(device._id) }));
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
