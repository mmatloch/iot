import FormCheckbox from '@components/forms/FormCheckbox';
import FormInputSelect from '@components/forms/FormInputSelect';
import { EventMetadataOnMultipleInstances, EventMetadataTaskType } from '@definitions/entities/eventTypes';
import { Divider, FormGroup } from '@mui/material';
import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import SchedulerRelativeCronForm from './Scheduler/SchedulerRelativeCronForm';
import SchedulerRelativeIntervalForm from './Scheduler/SchedulerRelativeIntervalForm';
import SchedulerStaticCronForm from './Scheduler/SchedulerStaticCronForm';
import SchedulerStaticIntervalForm from './Scheduler/SchedulerStaticIntervalForm';

export default function EventEditorSchedulerMetadataForm() {
    const { t } = useTranslation(['events', 'eventScheduler']);

    const currentTaskType = useWatch({
        name: 'metadata.taskType',
    });

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
        <FormGroup>
            <FormInputSelect
                name="metadata.taskType"
                label={t('events:entity.metadata.taskType')}
                validation={{ required: true }}
                margin="dense"
                items={taskTypeSelectItems}
            />

            {currentTaskType && <Divider sx={{ my: 2 }} />}

            {currentTaskType === EventMetadataTaskType.StaticCron && <SchedulerStaticCronForm />}

            {currentTaskType === EventMetadataTaskType.RelativeCron && <SchedulerRelativeCronForm />}

            {currentTaskType === EventMetadataTaskType.StaticInterval && <SchedulerStaticIntervalForm />}

            {currentTaskType === EventMetadataTaskType.RelativeInterval && <SchedulerRelativeIntervalForm />}

            <Divider sx={{ my: 2 }} />

            <FormInputSelect
                name="metadata.onMultipleInstances"
                label={t('events:entity.metadata.onMultipleInstances')}
                validation={{ required: true }}
                margin="dense"
                items={onMultipleInstancesSelectItems}
                helperText={t('eventScheduler:onMultipleInstancesDescription')}
            />

            <FormCheckbox name="metadata.recurring" label={t('events:entity.metadata.recurring')} margin="dense" />

            <FormCheckbox
                name="metadata.retryImmediatelyAfterBoot"
                label={t('events:entity.metadata.retryImmediatelyAfterBoot')}
                margin="dense"
            />
        </FormGroup>
    );
}
