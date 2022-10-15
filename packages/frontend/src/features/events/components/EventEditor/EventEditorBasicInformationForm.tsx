import FormInputSelect from '@components/forms/FormInputSelect';
import FormInputText from '@components/forms/FormInputText';
import { EventDto, EventTriggerType } from '@definitions/entities/eventTypes';
import { Divider, FormGroup } from '@mui/material';
import { useMemo } from 'react';
import { FormProvider, UseFormReturn, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import EventEditorSchedulerMetadataForm from './EventEditorSchedulerMetadataForm';

interface Props {
    methods: UseFormReturn<EventDto>;
}

export default function EventEditorBasicInformationForm({ methods }: Props) {
    const { t } = useTranslation();

    const currentTriggerType = methods.watch('triggerType');

    const triggerSelectItems = useMemo(
        () =>
            Object.values(EventTriggerType).map((triggerType) => ({
                value: triggerType,
                label: t(`events:triggerType.${triggerType}`),
            })),
        [t],
    );

    return (
        <FormProvider {...methods}>
            <FormGroup sx={{ m: 1 }}>
                <FormInputText
                    name="displayName"
                    label={t('events:entity.displayName')}
                    validation={{ required: true }}
                    margin="dense"
                    autoComplete="off"
                />

                <FormInputSelect
                    name="triggerType"
                    label={t('events:entity.triggerType')}
                    validation={{ required: true }}
                    margin="dense"
                    items={triggerSelectItems}
                />

                {currentTriggerType === EventTriggerType.Scheduler && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <EventEditorSchedulerMetadataForm methods={methods} />
                    </>
                )}
            </FormGroup>
        </FormProvider>
    );
}
