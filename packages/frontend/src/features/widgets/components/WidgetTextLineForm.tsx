import DeviceAutocomplete from '@components/devices/DeviceAutocomplete';
import EventAutocomplete from '@components/events/EventAutocomplete';
import { Device } from '@definitions/entities/deviceTypes';
import { Event } from '@definitions/entities/eventTypes';
import { Button, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useState } from 'react';

import { TextLineFromDeviceContext } from './TextLine/TextLineFromDeviceContext';

interface Props {
    onCancel: () => void;
}

const Tmp = ({ onCancel }: Props) => {
    const [value, setValue] = useState('DEVICE');
    const handleChange = (_event: unknown, newValue: string) => {
        setValue(newValue);
    };

    const handleEventChange = (_e: unknown, event: Event) => {
        console.log(event);
    };

    return (
        <>
            <ToggleButtonGroup value={value} exclusive onChange={handleChange}>
                <ToggleButton value="DEVICE">
                    <Typography>Device</Typography>
                </ToggleButton>
                <ToggleButton value="EVENT">
                    <Typography>Event</Typography>
                </ToggleButton>
            </ToggleButtonGroup>

            {value === 'DEVICE' && <TextLineFromDeviceContext />}
            {value === 'EVENT' && <EventAutocomplete onChange={handleEventChange} />}

            <Button onClick={onCancel}>Save</Button>
            <Button onClick={onCancel}>Cancel</Button>
        </>
    );
};

export const WidgetTextLineForm = () => {
    const [isOpen, open] = useState(false);

    const handleAddNextLine = () => {
        open(true);
    };

    const handleCancel = () => {
        open(false);
    };

    return isOpen ? <Tmp onCancel={handleCancel} /> : <Button onClick={handleAddNextLine}>Add text line</Button>;
};
