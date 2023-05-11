import FormInputNumber from '@components/forms/FormInputNumber';
import { FormGroup } from '@mui/material';
import { addSeconds } from 'date-fns';
import times from 'lodash/times';
import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import NextTriggerAtContainer from './NextTriggerAtContainer';

const NUMBER_OF_DATES = 5;

export default function SchedulerIntervalForm() {
    const { t } = useTranslation(['events', 'eventScheduler']);

    const currentInterval = useWatch({
        name: 'metadata.interval',
    });

    const dates = useMemo(() => {
        if (!currentInterval || Number.isNaN(currentInterval)) {
            return [];
        }

        const now = new Date();

        return times(NUMBER_OF_DATES, (i) => addSeconds(now, currentInterval * i + 1));
    }, [currentInterval]);

    return (
        <FormGroup>
            <FormInputNumber
                name="metadata.interval"
                label={t('events:entity.metadata.interval')}
                validation={{ required: true }}
                margin="dense"
                helperText={t('eventScheduler:intervalDescription')}
            />

            <NextTriggerAtContainer dates={dates} />
        </FormGroup>
    );
}
