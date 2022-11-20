import { useDevice } from '@api/devicesApi';
import DevicePowerSourceAvatar from '@components/avatars/DevicePowerSourceAvatar';
import DeviceProtocolAvatar from '@components/avatars/DeviceProtocolAvatar';
import DeviceTypeAvatar from '@components/avatars/DeviceTypeAvatar';
import FailedToLoadDataDialog from '@components/FailedToLoadDataDialog';
import FullScreenLoader from '@components/FullScreenLoader';
import { Box, Divider, Drawer, Stack, Toolbar, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
    deviceId: number;
    open: boolean;
    onClose: () => void;
}

const DRAWER_WIDTH = 300;

export default function DeviceDetailsDrawer({ open, onClose, deviceId }: Props) {
    const {t} = useTranslation()
    const { data, isSuccess, isLoading } = useDevice(deviceId);

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (!isSuccess) {
        return <FailedToLoadDataDialog />;
    }

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: DRAWER_WIDTH, boxSizing: 'border-box' },
            }}
        >
            <Toolbar />
            <Toolbar />
            <Box sx={{ m: 2 }}>
                <Typography variant="h6">{data.displayName}</Typography>

                <Typography>
                    {data.vendor} {data.model} ({data.manufacturer})
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Stack direction="row" spacing={1}>
                    <DeviceProtocolAvatar protocol={data.protocol} />
                    <DevicePowerSourceAvatar powerSource={data.powerSource} />
                    <DeviceTypeAvatar type={data.type} />
                </Stack>

                <Divider sx={{ my: 2 }} />
                <Typography>
                    {t('devices:entity.ieeeAddress')}: {data.ieeeAddress}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography>{data.description}</Typography>
            </Box>
        </Drawer>
    );
}
