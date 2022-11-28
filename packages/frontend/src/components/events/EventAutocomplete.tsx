import { useEvents } from '@api/eventsApi';
import { Event } from '@definitions/entities/eventTypes';
import { useDebounce } from '@hooks/useDebounce';
import { Autocomplete, AutocompleteProps, TextField, TextFieldProps } from '@mui/material';
import { useState } from 'react';

export interface Props extends Omit<AutocompleteProps<Event, false, true, false>, 'renderInput' | 'options'> {
    InputProps?: TextFieldProps;
    defaultValue?: Event;
}

export default function EventAutocomplete({ InputProps, ...props }: Props) {
    const [searchValue, setSearchValue] = useState('');
    const debouncedSearchValue = useDebounce(searchValue, 200);

    const { data, isLoading } = useEvents({
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
        <Autocomplete<Event, false, true, false>
            {...props}
            loading={isLoading}
            getOptionLabel={(event) => event.displayName}
            isOptionEqualToValue={(option, value) => option.displayName === value.displayName}
            onInputChange={handleChange}
            renderInput={(params) => <TextField {...params} {...InputProps} />}
            filterOptions={(x) => x}
            options={data?._hits || []}
        />
    );
}
