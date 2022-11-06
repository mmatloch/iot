import { EventRunSummaryChild } from '@definitions/eventTriggerTypes';
import { Card, CardContent, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import EventRunErrorPanel from './EventRunErrorPanel';
import EventRunPerformanceMetricsBar from './EventRunPerformanceMetricsBar';

interface Props {
    runSummary: EventRunSummaryChild;
}

export default function EventRunSummaryChildPanel({ runSummary }: Props) {
    const { t, i18n } = useTranslation();

    const stateTransKey = `eventInstances:state.${runSummary.eventInstance.state}` as const;

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">{runSummary.event.displayName}</Typography>

                {runSummary.parentEvent && (
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {t('eventInstances:entity.triggeredBy')}: {runSummary.parentEvent.displayName}
                    </Typography>
                )}

                <Typography variant="body2">
                    {t('generic:entity.id')}: {runSummary.event._id}
                </Typography>

                <Typography variant="body2">
                    {t('generic:entity.state')}: {i18n.format(t(stateTransKey), 'lowerCase')}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <EventRunPerformanceMetricsBar performanceMetrics={runSummary.eventInstance.performanceMetrics} />

                <Divider sx={{ my: 2 }} />

                {runSummary.eventInstance.error && <EventRunErrorPanel error={runSummary.eventInstance.error} />}
            </CardContent>
        </Card>
    );
}
