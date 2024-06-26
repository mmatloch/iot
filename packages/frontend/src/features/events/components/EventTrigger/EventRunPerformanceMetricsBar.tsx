import type { EventInstance } from '@definitions/entities/eventInstanceTypes';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
    performanceMetrics: EventInstance['performanceMetrics'];
}

const COLORS = {
    base: 'green',
    random: ['purple', 'orange', 'red'],
};

const HEIGHT = '40px';

export default function EventRunPerformanceMetricsBar({ performanceMetrics }: Props) {
    const { t } = useTranslation('eventInstances');

    return (
        <>
            <Typography>
                {t('entity.performanceMetrics.executionDuration')}: {performanceMetrics.executionDuration.toFixed(5)}
                ms
            </Typography>
            <Stack direction="row" sx={{ width: '100%', mt: 1, height: HEIGHT, backgroundColor: COLORS.base }}>
                {performanceMetrics.steps.map((step, index) => {
                    const width = (step.executionDuration / performanceMetrics.executionDuration) * 100;

                    return (
                        <Tooltip
                            title={
                                <Stack>
                                    <Typography>{step.name}</Typography>
                                    <Typography>{step.executionDuration.toFixed(5)}ms</Typography>
                                </Stack>
                            }
                            key={step.name}
                        >
                            <Box
                                sx={{ width: `${width}%`, height: HEIGHT, backgroundColor: COLORS.random[index] }}
                            ></Box>
                        </Tooltip>
                    );
                })}
            </Stack>
        </>
    );
}
