import type {
    AutocompleteRenderInputParams,
    BaseTextFieldProps,
    UseAutocompleteProps} from '@mui/material';
import {
    Autocomplete,
    TextField
} from '@mui/material';
import { useCallback } from 'react';
import type { RegisterOptions} from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';

type AutocompleteProps<T> = UseAutocompleteProps<T, false, true, false>;

interface Props<T>
    extends Pick<AutocompleteProps<T>, 'options' | 'getOptionLabel' | 'isOptionEqualToValue'>,
        Pick<BaseTextFieldProps, 'label' | 'margin'> {
    name: string;
    validation?: RegisterOptions;

    loading: boolean;
    formatOnSelect: (option: null | T) => unknown;
    onChange: (value: string) => void;
}

export default function FormLiveAutocomplete<T>(props: Props<T>) {
    const {
        control,
        register,
        formState: { errors },
    } = useFormContext();

    const renderInput = useCallback(
        (params: AutocompleteRenderInputParams) => {
            return <TextField {...params} margin={props.margin} label={props.label} error={!!errors[props.name]} />;
        },
        [errors, props.margin, props.label, props.name],
    );

    return (
        <Controller
            name={props.name}
            control={control}
            render={({ field }) => (
                <Autocomplete
                    {...field}
                    {...register(props.name, props.validation)}
                    options={props.options}
                    getOptionLabel={props.getOptionLabel}
                    isOptionEqualToValue={props.isOptionEqualToValue}
                    onChange={(_, data) => field.onChange(data)}
                    onInputChange={(_event, newInputValue) => {
                        props.onChange(newInputValue);
                    }}
                    filterOptions={(x) => x}
                    renderInput={renderInput}
                />
            )}
        />
    );
}
