import FormInputText from '@components/forms/FormInputText';
import { useCronParser } from '@features/events/hooks/useCronParser';
import { Alert, AlertTitle, FormGroup } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import NextTriggerAtContainer from './NextTriggerAtContainer';

export default function SchedulerCronExpressionForm() {
    const { t } = useTranslation(['generic', 'events']);

    const currentCronExpression = useWatch({
        name: 'metadata.cronExpression',
    });
    const { cronDates, parsingCronError } = useCronParser(currentCronExpression);

    return (
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
    );
}
