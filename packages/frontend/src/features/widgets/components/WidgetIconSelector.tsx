import { FormIconSelector } from '@components/forms/FormIconSelector';
import { useTranslation } from 'react-i18next';

export const WidgetIconSelector = () => {
    const { t } = useTranslation();

    return <FormIconSelector name="icon" label={t('widgets:entity.icon')} />;
};
