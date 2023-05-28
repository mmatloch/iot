import FormInputText from '@components/forms/FormInputText';
import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { DashboardComposer } from './DashboardComposer';

export const DashboardEditorForm = () => {
    const { t } = useTranslation('dashboards');

    return (
        <>
            <Stack spacing={1} sx={{ mb: 1 }}>
                <FormInputText
                    name="displayName"
                    label={t('entity.displayName')}
                    validation={{ required: true }}
                    margin="dense"
                />

                <DashboardComposer />
            </Stack>
        </>
    );
};
