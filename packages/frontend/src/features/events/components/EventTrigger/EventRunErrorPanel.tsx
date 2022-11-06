import { EventInstance } from '@definitions/entities/eventInstanceTypes';
import { Alert, AlertTitle, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
    error: EventInstance['error'];
}

export default function EventRunErrorPanel({ error }: Props) {
    const { t } = useTranslation();

    return (
        <Box>
            <Alert severity="error">
                <AlertTitle>{t('generic:error')}</AlertTitle>

                <Typography variant="body2" sx={{ mb: 1 }}>
                    {error.message as string}
                </Typography>

                {error.cause && (
                    <>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            {error.cause.message}
                        </Typography>
                        <Typography variant="body2">{error.cause.stack}</Typography>
                    </>
                )}
            </Alert>
        </Box>
    );
}
