import AllowDevicesToJoinButton from '@components/configurations/AllowDevicesToJoinButton';
import type { Configuration } from '@definitions/entities/configurationTypes';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
    configuration: Configuration;
    onSuccess: () => void;
}

export default function AllowToJoinStep({ configuration, onSuccess }: Props) {
    const { t } = useTranslation(['generic', 'devices']);

    return (
        <Box>
            <Typography>{t('devices:creator.allowToJoin.description')}</Typography>
            <Box sx={{ mt: 4 }}></Box>

            <Typography color="error" fontWeight="bold">
                {t('devices:creator.allowToJoin.prompt.title')}
            </Typography>
            <Typography color="error" fontStyle="italic">
                {t('devices:creator.allowToJoin.prompt.helper')}
            </Typography>

            <Box sx={{ mt: 4 }}></Box>

            <AllowDevicesToJoinButton configuration={configuration} onSuccess={onSuccess}>
                {t('generic:allow')}
            </AllowDevicesToJoinButton>
        </Box>
    );
}
