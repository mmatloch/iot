import FormInputText from '@components/forms/FormInputText';
import { EventDto } from '@definitions/entities/eventTypes';
import { useCronParser } from '@features/events/hooks/useCronParser';
import { Alert, AlertTitle, FormGroup } from '@mui/material';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import NextTriggerAtContainer from './NextTriggerAtContainer';

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

                {cronDates && <NextTriggerAtContainer dates={cronDates} />}
            </FormGroup>
        </FormProvider>
    );
}
