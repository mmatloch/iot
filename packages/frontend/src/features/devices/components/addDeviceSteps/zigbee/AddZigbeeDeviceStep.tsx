import { useDevices } from '@api/devicesApi';
import { Device, DeviceProtocol } from '@definitions/entities/deviceTypes';
import { Box, CircularProgress, Typography } from '@mui/material';
import { subMinutes } from 'date-fns';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import DeviceCard from '../../DeviceCard';

interface Props {
    onDeviceSelect: (device: Device) => void;
}

export default function AddZigbeeDeviceStep({ onDeviceSelect }: Props) {
    const { t } = useTranslation();
    const [now] = useState(new Date());

    const { data } = useDevices(
        {
            filters: {
                protocol: DeviceProtocol.Zigbee,
                _createdAt: {
                    $gte: subMinutes(now, 10).toISOString(),
                },
            },
        },
        {
            refetchInterval: 1000,
        },
    );

    return (
        <Box>
            <Typography variant="h6">{t('devices:creator.addDevice.lookingForDevices')}</Typography>

            <CircularProgress sx={{ mt: 3 }} />

            <Box sx={{ mt: 3 }}>
                {data?._hits.map((device) => {
                    return (
                        <Box key={device._id} sx={{ mt: 1, cursor: 'pointer' }} onClick={() => onDeviceSelect(device)}>
                            <DeviceCard device={device} hideMenu raised />
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}
