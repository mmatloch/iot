import { useTranslation } from 'react-i18next';

import ErrorDialog from './ErrorDialog';

export default function FailedToLoadDataDialog() {
    const { t } = useTranslation();

    return (
        <ErrorDialog title={t('generic:errors.failedToLoadData')} message={t('generic:errors.noInternetConnection')} />
    );
}
