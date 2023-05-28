import { useWidgets } from '@api/widgetsApi';
import type { Widget } from '@definitions/entities/widgetTypes';
import { useDebounce } from '@hooks/useDebounce';
import type { AutocompleteProps, TextFieldProps } from '@mui/material';
import { Autocomplete, TextField } from '@mui/material';
import { useMemo, useState } from 'react';

export interface Props extends Omit<AutocompleteProps<Widget, false, true, false>, 'renderInput' | 'options'> {
    InputProps?: TextFieldProps;
    defaultValue?: Widget;
}

export default function WidgetAutocomplete({ InputProps, ...props }: Props) {
    const [searchValue, setSearchValue] = useState('');
    const debouncedSearchValue = useDebounce(searchValue, 200);

    const widgetsQuery = useMemo(() => {
        return {
            filters: {
                displayName: {
                    $iLike: `${debouncedSearchValue}%`,
                },
            },
        };
    }, [debouncedSearchValue]);

    const { data, isLoading } = useWidgets(widgetsQuery);

    const handleChange = (_: unknown, value: string) => {
        setSearchValue(value);
    };

    return (
        <Autocomplete<Widget, false, true, false>
            {...props}
            loading={isLoading}
            getOptionLabel={(widget) => widget.displayName}
            isOptionEqualToValue={(option, value) => option.displayName === value.displayName}
            onInputChange={handleChange}
            renderInput={(params) => <TextField {...params} {...InputProps} />}
            filterOptions={(x) => x}
            options={data?._hits || []}
        />
    );
}
