import { useEvents } from '@api/eventsApi';
import type { Event, EventsSearchQuery } from '@definitions/entities/eventTypes';
import { useDebounce } from '@hooks/useDebounce';
import type { AutocompleteProps, TextFieldProps } from '@mui/material';
import { Autocomplete, TextField } from '@mui/material';
import { mergeQuery } from '@utils/searchQuery';
import { useMemo, useState } from 'react';

export interface Props extends Omit<AutocompleteProps<Event, false, true, false>, 'renderInput' | 'options'> {
    InputProps?: TextFieldProps;
    defaultValue?: Event;
    searchQuery?: EventsSearchQuery;
}

export default function EventAutocomplete({ InputProps, searchQuery, ...props }: Props) {
    const [searchValue, setSearchValue] = useState('');
    const debouncedSearchValue = useDebounce(searchValue, 200);

    const eventsQuery = useMemo(() => {
        return mergeQuery(
            {
                filters: {
                    displayName: {
                        $iLike: `${debouncedSearchValue}%`,
                    },
                },
            },
            searchQuery ?? {},
        );
    }, [debouncedSearchValue, searchQuery]);

    const { data, isLoading } = useEvents(eventsQuery);

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
