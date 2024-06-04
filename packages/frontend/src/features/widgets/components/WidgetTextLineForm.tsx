import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useTextLinesForm } from '../hooks/useTextLinesForm';
import { TextLineList } from './TextLine/TextLineList';

export const WidgetTextLineForm = () => {
    const { t } = useTranslation('widgets');
    const { append } = useTextLinesForm();

    const handleAddNextLine = () => {
        append({
            value: '',
            deviceId: null,
            useDeviceSensorData: false,
            eventId: null,
            id: window.crypto.randomUUID(),
            styles: {},
        });
    };

    return (
        <>
            <TextLineList />
            <Button onClick={handleAddNextLine} sx={{ mt: 1 }}>
                {t('creator.addTextLine')}
            </Button>
        </>
    );
};
