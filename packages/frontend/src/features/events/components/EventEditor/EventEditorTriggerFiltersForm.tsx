import DeviceAutocomplete from '@components/devices/DeviceAutocomplete';
import type { Device } from '@definitions/entities/deviceTypes';
import type { EventDto } from '@definitions/entities/eventTypes';
import { FormGroup, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import type { MouseEvent } from 'react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

enum FilterOption {
    ForDevice = 'FOR_DEVICE',
    Raw = 'RAW',
}

export default function EventEditorTriggerFiltersForm() {
    const { t } = useTranslation('events');
    const [filterOption, setFilterOption] = useState('');
    const methods = useFormContext<EventDto>();

    const handleChange = (_event: MouseEvent<HTMLElement>, newFilterOption: FilterOption) => {
        setFilterOption(newFilterOption);
    };

    const handleDeviceSelect = (_: unknown, newDevice: Device | null) => {
        if (!newDevice) {
            return;
        }

        const value = {
            deviceId: newDevice._id,
        };

        methods.setValue('triggerFilters', value);
    };

    return (
        <FormGroup>
            <Typography variant="h6">{t('editor.triggerFilters.title')}</Typography>
            <Typography variant="caption">{t('editor.triggerFilters.description')} </Typography>

            <ToggleButtonGroup color="primary" value={filterOption} exclusive onChange={handleChange} sx={{ my: 2 }}>
                <ToggleButton value={FilterOption.ForDevice}>{t('editor.triggerFilters.forDevice')}</ToggleButton>
            </ToggleButtonGroup>

            {filterOption === FilterOption.ForDevice && <DeviceAutocomplete onChange={handleDeviceSelect} />}
        </FormGroup>
    );
}
