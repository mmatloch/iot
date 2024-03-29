import { useDevices } from '@api/devicesApi';
import type { Device } from '@definitions/entities/deviceTypes';
import { useDebounce } from '@hooks/useDebounce';
import type { AutocompleteProps, TextFieldProps } from '@mui/material';
import { Autocomplete, TextField } from '@mui/material';
import { useState } from 'react';

export interface Props extends Omit<AutocompleteProps<Device, false, true, false>, 'renderInput' | 'options'> {
    InputProps?: TextFieldProps;
    defaultValue?: Device;
}

export default function DeviceAutocomplete({ InputProps, ...props }: Props) {
    const [searchValue, setSearchValue] = useState('');
    const debouncedSearchValue = useDebounce(searchValue, 200);

    const { data, isLoading } = useDevices({
        filters: {
            displayName: {
                $iLike: `${debouncedSearchValue}%`,
            },
        },
    });

    const handleChange = (_: unknown, value: string) => {
        setSearchValue(value);
    };

    return (
        <Autocomplete<Device, false, true, false>
            {...props}
            loading={isLoading}
            getOptionLabel={(device) => device.displayName}
            isOptionEqualToValue={(option, value) => option.displayName === value.displayName}
            onInputChange={handleChange}
            renderInput={(params) => <TextField {...params} {...InputProps} />}
            filterOptions={(x) => x}
            options={data?._hits || []}
        />
    );
}
