import FormInputSelect from '@components/forms/FormInputSelect';
import FormInputText from '@components/forms/FormInputText';
import type { EventDto} from '@definitions/entities/eventTypes';
import { EventTriggerType } from '@definitions/entities/eventTypes';
import { Divider, FormGroup } from '@mui/material';
import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import EventEditorSchedulerMetadataForm from './EventEditorSchedulerMetadataForm';
import EventEditorTriggerFiltersForm from './EventEditorTriggerFiltersForm';

export default function EventEditorBasicInformationForm() {
    const { t } = useTranslation();

    const currentTriggerType = useWatch<EventDto>({
        name: 'triggerType',
    });

    const triggerSelectItems = useMemo(
        () =>
            Object.values(EventTriggerType).map((triggerType) => ({
                value: triggerType,
                label: t(`events:triggerType.${triggerType}`),
            })),
        [t],
    );

    return (
        <FormGroup>
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
                    <EventEditorSchedulerMetadataForm />
                </>
            )}

            {currentTriggerType !== EventTriggerType.Scheduler && (
                <>
                    <Divider sx={{ my: 2 }} />
                    <EventEditorTriggerFiltersForm />
                </>
            )}
        </FormGroup>
    );
}
