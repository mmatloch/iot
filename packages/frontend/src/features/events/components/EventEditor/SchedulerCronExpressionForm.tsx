import FormInputText from '@components/forms/FormInputText';
import { EventDto } from '@definitions/entities/eventTypes';
import { useCronParser } from '@features/events/hooks/useCronParser';
import { Alert, AlertTitle, FormGroup, Paper, Stack, Typography } from '@mui/material';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Props {
    methods: UseFormReturn<EventDto>;
}

export default function SchedulerCronExpressionForm({ methods }: Props) {
    const { t } = useTranslation();

    const currentCronExpression = methods.watch('metadata.cronExpression');
    const { cronDates, parsingCronError } = useCronParser(currentCronExpression);

    return (
        <FormProvider {...methods}>
            <FormGroup>
                <FormInputText
                    name="metadata.cronExpression"
                    label={t('events:entity.metadata.cronExpression')}
                    validation={{ required: true }}
                    margin="dense"
                />

                {parsingCronError && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                        <AlertTitle>{t('generic:error')}</AlertTitle>
                        {t('events:errors.failedToParseCronExpression')}
                    </Alert>
                )}

                {cronDates && (
                    <Paper elevation={0} sx={{ p: 1, mt: 1 }}>
                        <Typography variant="h5">{t('events:cronExpression.nextTriggerAt')}</Typography>
                        <Stack spacing={1} sx={{ mt: 1 }}>
                            {cronDates?.map((cronDate) => (
                                <Typography>{cronDate.toLocaleString()}</Typography>
                            ))}
                        </Stack>
                    </Paper>
                )}
            </FormGroup>
        </FormProvider>
    );
}
