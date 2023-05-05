import { useTranslation } from 'react-i18next';

import ErrorDialog from './ErrorDialog';

export default function FailedToLoadDataDialog() {
    const { t } = useTranslation();

    return <ErrorDialog title={t('errors.failedToLoadData')} message={t('errors.noInternetConnection')} />;
}
