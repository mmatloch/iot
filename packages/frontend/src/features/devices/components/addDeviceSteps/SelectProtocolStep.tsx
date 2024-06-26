import type { DeviceProtocol } from '@definitions/entities/deviceTypes';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import DeviceProtocolList from '../DeviceProtocolList';

interface Props {
    onSelect: (protocol: DeviceProtocol) => void;
}

export default function SelectProtocolStep({ onSelect }: Props) {
    const { t } = useTranslation('devices');

    return (
        <Box>
            <Typography>{t('creator.selectProtocolStep.description')}</Typography>
            <Box sx={{ mt: 2 }}>
                <DeviceProtocolList onSelect={onSelect} />
            </Box>
        </Box>
    );
}
