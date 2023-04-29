import FormInputText from '@components/forms/FormInputText';
import { FormGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { WidgetIconSelector } from './WidgetIconSelector';

export const WidgetEditorForm = () => {
    const { t } = useTranslation();

    return (
        <FormGroup sx={{ m: 1 }}>
            <FormInputText
                name="displayName"
                label={t('widgets:entity.displayName')}
                validation={{ required: true }}
                margin="dense"
            />

            <WidgetIconSelector />
        </FormGroup>
    );
};
