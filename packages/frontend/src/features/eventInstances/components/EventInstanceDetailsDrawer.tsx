import { useEventInstance } from '@api/eventInstancesApi';
import FailedToLoadDataDialog from '@components/FailedToLoadDataDialog';
import FullScreenLoader from '@components/FullScreenLoader';
import EventRunErrorPanel from '@features/events/components/EventTrigger/EventRunErrorPanel';
import EventRunPerformanceMetricsBar from '@features/events/components/EventTrigger/EventRunPerformanceMetricsBar';
import { Box, Divider, Drawer, Toolbar, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
    eventInstanceId: number;
    open: boolean;
    onClose: () => void;
}

const DRAWER_WIDTH = 300;

export default function EventInstanceDetailsDrawer({ open, onClose, eventInstanceId }: Props) {
    const { t } = useTranslation();
    const { data, isSuccess, isLoading } = useEventInstance(eventInstanceId);

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
                <Typography variant="h6">{data.event.displayName}</Typography>

                <Divider sx={{ my: 2 }} />

                <Typography>{t('eventInstances:entity.triggerContext')}</Typography>
                <pre>{JSON.stringify(data.triggerContext, null, 2)}</pre>

                <Divider sx={{ my: 2 }} />

                <EventRunPerformanceMetricsBar performanceMetrics={data.performanceMetrics} />

                {data.error && <EventRunErrorPanel error={data.error} />}
            </Box>
        </Drawer>
    );
}
