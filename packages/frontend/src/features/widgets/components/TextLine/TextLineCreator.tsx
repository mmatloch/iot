import { useTextLinesForm } from '@features/widgets/hooks/useTextLinesForm';
import { useWidgetForm } from '@features/widgets/hooks/useWidgetForm';
import { Button, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { TextLineFromDeviceContext } from './TextLineFromDeviceContext';
import { TextLineFromEventContext } from './TextLineFromEventContext';

interface Props {
    lineIndex: number;
}

enum SelectedButton {
    Device = 'DEVICE',
    Event = 'EVENT',
}

export const TextLineCreator = ({ lineIndex }: Props) => {
    const { t } = useTranslation(['generic', 'devices', 'events']);
    const { remove } = useTextLinesForm();
    const { watch } = useWidgetForm();
    const textLines = watch('textLines');

    const [selectedButton, setSelectedButton] = useState(() => {
        const currentValue = textLines[lineIndex];
        return currentValue?.eventId ? SelectedButton.Event : SelectedButton.Device;
    });

    const handleRemove = () => {
        remove(lineIndex);
    };

    const handleChange = (_event: unknown, newValue: SelectedButton) => {
        setSelectedButton(newValue);
    };

    return (
        <>
            <ToggleButtonGroup value={selectedButton} exclusive onChange={handleChange}>
                <ToggleButton value={SelectedButton.Device}>
                    <Typography>{t('devices:entityName')}</Typography>
                </ToggleButton>
                <ToggleButton value={SelectedButton.Event}>
                    <Typography>{t('events:entityName')}</Typography>
                </ToggleButton>
            </ToggleButtonGroup>

            {selectedButton === SelectedButton.Device && <TextLineFromDeviceContext lineIndex={lineIndex} />}
            {selectedButton === SelectedButton.Event && <TextLineFromEventContext lineIndex={lineIndex} />}

            <Button onClick={handleRemove}>{t('generic:clear')}</Button>
        </>
    );
};
