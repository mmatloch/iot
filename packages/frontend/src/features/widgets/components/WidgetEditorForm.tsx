import FormInputText from '@components/forms/FormInputText';
import { FormGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';

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

            <FormInputText
                name="icon"
                label={t('widgets:entity.icon')}
                validation={{ required: true }}
                margin="dense"
            />
        </FormGroup>
    );
};
