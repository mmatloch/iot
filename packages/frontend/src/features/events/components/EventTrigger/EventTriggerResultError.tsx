import { HttpError } from '@errors/httpError';
import { Alert, AlertTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
    error: Error;
}

export default function EventTriggerResultError({ error }: Props) {
    const { t } = useTranslation();

    if (error instanceof HttpError) {
        return (
            <>
                <Alert severity="error">
                    <AlertTitle>
                        {t('errors.errorOccured')} ({t('statusCode')} {error.statusCode})
                    </AlertTitle>
                    {error.message}
                </Alert>

                <Alert severity="error">{error.detail}</Alert>
            </>
        );
    }

    return (
        <>
            <Alert severity="error">
                <AlertTitle>{t('errors.unknownErrorOccured')}</AlertTitle>
                {error.message}
            </Alert>
        </>
    );
}
