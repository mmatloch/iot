import FormInputText from '@components/forms/FormInputText';
import { useTextLinesForm } from '@features/widgets/hooks/useTextLinesForm';
import { useWidgetForm } from '@features/widgets/hooks/useWidgetForm';
import { Button, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { TextLineFromDeviceContext } from './TextLineFromDeviceContext';
import { TextLineFromEventContext } from './TextLineFromEventContext';

interface Props {
    lineIndex: number;
}

enum SelectedButton {
    Default = 'DEFAULT',
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
        if (currentValue.eventId) {
            return SelectedButton.Event;
        }

        if (currentValue.deviceId) {
            return SelectedButton.Device;
        }

        return SelectedButton.Default;
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
                <ToggleButton value={SelectedButton.Default}>
                    <Typography>{t('default')}</Typography>
                </ToggleButton>

                <ToggleButton value={SelectedButton.Device}>
                    <Typography>{t('devices:entityName')}</Typography>
                </ToggleButton>
                <ToggleButton value={SelectedButton.Event}>
                    <Typography>{t('events:entityName')}</Typography>
                </ToggleButton>
            </ToggleButtonGroup>

            <Stack spacing={1} sx={{ mt: 1 }}>
                {selectedButton === SelectedButton.Device && <TextLineFromDeviceContext lineIndex={lineIndex} />}
                {selectedButton === SelectedButton.Event && <TextLineFromEventContext lineIndex={lineIndex} />}

                <FormInputText name={`textLines.${lineIndex}.value`} label={t('value')} />
            </Stack>

            <Button onClick={handleRemove} sx={{ my: 1 }}>
                {t('generic:clear')}
            </Button>
        </>
    );
};
