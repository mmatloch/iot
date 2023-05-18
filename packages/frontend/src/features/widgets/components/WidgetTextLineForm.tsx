import DeviceAutocomplete from '@components/devices/DeviceAutocomplete';
import EventAutocomplete from '@components/events/EventAutocomplete';
import { Device } from '@definitions/entities/deviceTypes';
import { Event } from '@definitions/entities/eventTypes';
import { WidgetDto } from '@definitions/entities/widgetTypes';
import { Button, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { useTextLinesForm } from '../hooks/useTextLinesForm';
import { useWidgetForm } from '../hooks/useWidgetForm';
import { TextLineFromDeviceContext } from './TextLine/TextLineFromDeviceContext';

interface Props {
    lineIndex: number;
}

enum SelectedButton {
    Device = 'DEVICE',
    Event = 'EVENT',
}

const Tmp = ({ lineIndex }: Props) => {
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

    const handleEventChange = (_e: unknown, event: Event) => {
        console.log(event);
    };

    return (
        <>
            <ToggleButtonGroup value={selectedButton} exclusive onChange={handleChange}>
                <ToggleButton value={SelectedButton.Device}>
                    <Typography>Device</Typography>
                </ToggleButton>
                <ToggleButton value={SelectedButton.Event}>
                    <Typography>Event</Typography>
                </ToggleButton>
            </ToggleButtonGroup>

            {selectedButton === SelectedButton.Device && <TextLineFromDeviceContext lineIndex={lineIndex} />}
            {selectedButton === SelectedButton.Event && <EventAutocomplete onChange={handleEventChange} />}

            <Button onClick={handleRemove}>Remove</Button>
        </>
    );
};

const TmpList = () => {
    const { watch } = useWidgetForm();
    const textLines = watch('textLines');

    return (
        <Stack spacing={1}>
            {textLines.map((field, index) => (
                <Tmp key={field.id} lineIndex={index} />
            ))}
        </Stack>
    );
};

export const WidgetTextLineForm = () => {
    const { append } = useTextLinesForm();

    const handleAddNextLine = () => {
        append({
            value: '',
            deviceId: null,
            eventId: null,
            id: window.crypto.randomUUID(),
        });
    };

    return (
        <>
            <TmpList />
            <Button onClick={handleAddNextLine}>Add text line</Button>
        </>
    );
};
