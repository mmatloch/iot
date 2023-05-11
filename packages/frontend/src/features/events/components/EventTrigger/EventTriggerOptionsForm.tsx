import FormInputSelect from '@components/forms/FormInputSelect';
import { EventActionOnInactive } from '@definitions/entities/eventTypes';
import { Box, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function EventTriggerOptionsForm() {
    const { t } = useTranslation('events');

    const onInactiveSelectItems = useMemo(
        () =>
            Object.values(EventActionOnInactive).map((option) => ({
                value: option,
                label: t(`onInactive.${option}`),
            })),
        [t],
    );

    return (
        <Box sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
                {t('editor.triggerPanel.options.title')}
            </Typography>

            <FormInputSelect
                name="options.onInactive"
                label={t('editor.triggerPanel.onInactive.title')}
                helperText={t('editor.triggerPanel.onInactive.description')}
                validation={{ required: true }}
                margin="dense"
                items={onInactiveSelectItems}
            />
        </Box>
    );
}
