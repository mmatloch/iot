import { Device } from '@definitions/entities/deviceTypes';
import { EventDto } from '@definitions/entities/eventTypes';
import DeviceAutocomplete from '@features/devices/components/DeviceAutocomplete';
import { FormGroup, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { MouseEvent, useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

enum FilterOption {
    ForDevice = 'FOR_DEVICE',
    Raw = 'RAW',
}

export default function EventEditorTriggerFiltersForm() {
    const { t } = useTranslation();
    const [filterOption, setFilterOption] = useState('');
    const methods = useFormContext<EventDto>();

    const handleChange = (_event: MouseEvent<HTMLElement>, newFilterOption: FilterOption) => {
        setFilterOption(newFilterOption);
    };

    const handleDeviceSelect = useCallback((_: unknown, newDevice: Device | null) => {
        if (!newDevice) {
            return;
        }

        const value = {
            deviceId: newDevice._id,
        };

        methods.setValue('triggerFilters', value);
    }, []);

    return (
        <FormGroup>
            <Typography variant="h6">{t('events:editor.triggerFilters.title')}</Typography>
            <Typography variant="caption">{t('events:editor.triggerFilters.description')} </Typography>

            <ToggleButtonGroup color="primary" value={filterOption} exclusive onChange={handleChange} sx={{ my: 2 }}>
                <ToggleButton value={FilterOption.ForDevice}>
                    {t('events:editor.triggerFilters.forDevice')}
                </ToggleButton>
            </ToggleButtonGroup>

            {filterOption === FilterOption.ForDevice && <DeviceAutocomplete onChange={handleDeviceSelect} />}
        </FormGroup>
    );
}
