import FormInputText from '@components/forms/FormInputText';
import { EventDto } from '@definitions/entities/eventTypes';
import { FormGroup } from '@mui/material';
import { addSeconds } from 'date-fns';
import times from 'lodash/times';
import { useMemo } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import NextTriggerAtContainer from './NextTriggerAtContainer';

interface Props {
    methods: UseFormReturn<EventDto>;
}

const NUMBER_OF_DATES = 5;

export default function SchedulerIntervalForm({ methods }: Props) {
    const { t } = useTranslation();

    const currentInterval = methods.watch('metadata.interval');

    const dates = useMemo(() => {
        const now = new Date();

        return times(NUMBER_OF_DATES, (i) => addSeconds(now, currentInterval * i + 1));
    }, [currentInterval]);

    return (
        <FormProvider {...methods}>
            <FormGroup>
                <FormInputText
                    name="metadata.interval"
                    type="number"
                    label={t('events:entity.metadata.interval')}
                    validation={{ required: true }}
                    margin="dense"
                    helperText={t('events:scheduler.intervalDescription')}
                />

                <NextTriggerAtContainer dates={dates} />
            </FormGroup>
        </FormProvider>
    );
}
