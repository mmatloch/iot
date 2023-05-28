import FormInputText from '@components/forms/FormInputText';
import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { WidgetIconSelector } from './WidgetIconSelector';
import { WidgetTextLineForm } from './WidgetTextLineForm';

export const WidgetEditorForm = () => {
    const { t } = useTranslation('widgets');

    return (
        <>
            <Stack spacing={1} sx={{ mb: 1 }}>
                <FormInputText
                    name="displayName"
                    label={t('entity.displayName')}
                    validation={{ required: true }}
                    margin="dense"
                />

                <WidgetIconSelector />
            </Stack>

            <WidgetTextLineForm />
        </>
    );
};
