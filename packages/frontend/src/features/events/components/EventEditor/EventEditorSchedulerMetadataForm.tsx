import FormCheckbox from '@components/forms/FormCheckbox';
import FormInputSelect from '@components/forms/FormInputSelect';
import { EventDto, EventMetadataOnMultipleInstances, EventMetadataTaskType } from '@definitions/entities/eventTypes';
import { Divider, FormGroup } from '@mui/material';
import { useMemo } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import SchedulerRelativeCronForm from './SchedulerRelativeCronForm';

interface Props {
    methods: UseFormReturn<EventDto>;
}

export default function EventEditorSchedulerMetadataForm({ methods }: Props) {
    const { t } = useTranslation();

    const currentTaskType = methods.watch('metadata.taskType');

    const taskTypeSelectItems = useMemo(
        () =>
            Object.values(EventMetadataTaskType).map((option) => ({
                value: option,
                label: t(`events:metadataTaskType.${option}`),
            })),
        [t],
    );

    const onMultipleInstancesSelectItems = useMemo(
        () =>
            Object.values(EventMetadataOnMultipleInstances).map((option) => ({
                value: option,
                label: t(`events:metadataOnMultipleInstances.${option}`),
            })),
        [t],
    );

    return (
        <FormProvider {...methods}>
            <FormGroup>
                <FormInputSelect
                    name="metadata.taskType"
                    label={t('events:entity.metadata.taskType')}
                    validation={{ required: true }}
                    margin="dense"
                    items={taskTypeSelectItems}
                />

                {currentTaskType === EventMetadataTaskType.RelativeCron && (
                    <SchedulerRelativeCronForm methods={methods} />
                )}

                <Divider sx={{ my: 2 }} />

                <FormInputSelect
                    name="metadata.onMultipleInstances"
                    label={t('events:entity.metadata.onMultipleInstances')}
                    validation={{ required: true }}
                    margin="dense"
                    items={onMultipleInstancesSelectItems}
                />

                <FormCheckbox
                    name="metadata.recurring"
                    label={t('events:entity.metadata.recurring')}
                    validation={{ required: true }}
                    margin="dense"
                />

                <FormCheckbox
                    name="metadata.retryImmediatelyAfterBoot"
                    label={t('events:entity.metadata.retryImmediatelyAfterBoot')}
                    validation={{ required: true }}
                    margin="dense"
                />
            </FormGroup>
        </FormProvider>
    );
}
