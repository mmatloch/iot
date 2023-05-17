import DeviceAutocomplete from '@components/devices/DeviceAutocomplete';
import FormInputText from '@components/forms/FormInputText';
import { Device } from '@definitions/entities/deviceTypes';
import { Alert, FormControl, FormHelperText, MenuItem, Stack } from '@mui/material';
import { useState } from 'react';

const renderSuggestionItem = (): MentionProps['renderSuggestion'] => {
    // eslint-disable-next-line react/display-name
    return (suggestion) => {
        const itemContent = suggestion.display;

        return (
            <MenuItem component="div" style={{ height: '100%', width: '100%' }}>
                {itemContent}
            </MenuItem>
        );
    };
};

export const TextLineFromDeviceContext = () => {
    const [currentDevice, setDevice] = useState<Device>();
    const [textLine, setTextLine] = useState('');

    const handleDeviceChange = (_e: unknown, device: Device) => {
        console.log(device);
        setDevice(device);
    };

    const handleLineChange = (_, newValue) => {
        console.log(newValue);
        setTextLine(newValue);
    };

    const hasFeatures = currentDevice?.features.length;

    return (
        <Stack spacing={1}>
            <DeviceAutocomplete onChange={handleDeviceChange} value={currentDevice} />

            {currentDevice && !hasFeatures && <Alert severity="error">This device has no features</Alert>}

            <FormInputText name="line" />
        </Stack>
    );
};
