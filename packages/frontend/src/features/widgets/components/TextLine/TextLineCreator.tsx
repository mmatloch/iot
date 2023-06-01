import FormInputText from '@components/forms/FormInputText';
import { useTextLinesForm } from '@features/widgets/hooks/useTextLinesForm';
import { useWidgetForm } from '@features/widgets/hooks/useWidgetForm';
import { TextDecrease, TextIncrease } from '@mui/icons-material';
import { Button, ButtonGroup, IconButton, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
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

const FONT_SIZE_STEP = 4;
const DEFAULT_FONT_SIZE = 14;

export const TextLineCreator = ({ lineIndex }: Props) => {
    const { t } = useTranslation(['generic', 'devices', 'events']);
    const { remove, update } = useTextLinesForm();
    const { watch } = useWidgetForm();
    const textLines = watch('textLines');

    const currentTextLine = textLines[lineIndex];

    const [selectedButton, setSelectedButton] = useState(() => {
        if (currentTextLine.eventId) {
            return SelectedButton.Event;
        }

        if (currentTextLine.deviceId) {
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

    const handleTextDecrease = () => {
        const { fontSize } = currentTextLine.styles;

        let numericFontSize = Number(fontSize);

        if (Number.isNaN(numericFontSize)) {
            numericFontSize = DEFAULT_FONT_SIZE;
        }

        const updatedTextLine = {
            ...currentTextLine,
            styles: {
                ...currentTextLine.styles,
                fontSize: numericFontSize - FONT_SIZE_STEP,
            },
        };

        update(lineIndex, updatedTextLine);
    };

    const handleTextIncrease = () => {
        const { fontSize } = currentTextLine.styles;

        let numericFontSize = Number(fontSize);

        if (Number.isNaN(numericFontSize)) {
            numericFontSize = DEFAULT_FONT_SIZE;
        }

        const updatedTextLine = {
            ...currentTextLine,
            styles: {
                ...currentTextLine.styles,
                fontSize: numericFontSize + FONT_SIZE_STEP,
            },
        };

        update(lineIndex, updatedTextLine);
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

                <Stack spacing={1}>
                    <ButtonGroup>
                        <IconButton onClick={handleTextDecrease}>
                            <TextDecrease />
                        </IconButton>
                        <IconButton onClick={handleTextIncrease}>
                            <TextIncrease />
                        </IconButton>
                    </ButtonGroup>

                    <FormInputText name={`textLines.${lineIndex}.value`} label={t('value')} />
                </Stack>
            </Stack>

            <Button onClick={handleRemove} sx={{ my: 1 }}>
                {t('generic:clear')}
            </Button>
        </>
    );
};
