import { Paper, Stack, Typography } from '@mui/material';
import { formatISO9075 } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface Props {
    dates: Date[];
}

export default function NextTriggerAtContainer({ dates }: Props) {
    const { t } = useTranslation();

    return (
        <Paper elevation={0} sx={{ p: 1, mt: 1 }}>
            <Typography variant="h5">{t('eventScheduler:nextTriggerAt')}</Typography>
            <Stack spacing={1} sx={{ mt: 1 }}>
                {dates?.map((date) => (
                    <Typography key={date.valueOf()}>
                        {formatISO9075(date, {
                            representation: 'complete',
                        })}
                    </Typography>
                ))}
            </Stack>
        </Paper>
    );
}
