import { useFormErrorTranslation } from '@hooks/useFormErrorTranslation';
import type {
    AutocompleteRenderInputParams,
    AutocompleteRenderOptionState,
    BaseTextFieldProps,
    UseAutocompleteProps,
} from '@mui/material';
import { Autocomplete, TextField } from '@mui/material';
import { HTMLAttributes, ReactNode, useCallback } from 'react';
import { RegisterOptions, get } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';

type AutocompleteProps<T> = UseAutocompleteProps<T, false, true, false>;

interface Props<T>
    extends Pick<AutocompleteProps<T>, 'options' | 'getOptionLabel' | 'isOptionEqualToValue' | 'filterOptions'>,
        Pick<BaseTextFieldProps, 'label' | 'margin'> {
    name: string;
    validation?: RegisterOptions;

    loading: boolean;
    formatOnSelect: (option: null | T) => unknown;
    onChange: (value: string) => void;
    renderOption?: (props: HTMLAttributes<HTMLLIElement>, option: T, state: AutocompleteRenderOptionState) => ReactNode;
}

const DEFAULT_FILTER_OPTIONS = <T,>(x: T) => x;

export default function FormLiveAutocomplete<T>({
    name,
    margin,
    label,
    options,
    validation,
    isOptionEqualToValue,
    getOptionLabel,
    onChange,
    filterOptions,
    renderOption,
}: Props<T>) {
    const {
        control,
        register,
        formState: { errors },
    } = useFormContext();

    const error = get(errors, name);
    const errorMessage = useFormErrorTranslation(error);
    const hasError = !!error;

    const renderInput = useCallback(
        (params: AutocompleteRenderInputParams) => {
            return <TextField {...params} margin={margin} label={label} error={hasError} helperText={errorMessage} />;
        },
        [margin, label, hasError, errorMessage],
    );

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <Autocomplete
                    {...field}
                    {...register(name, validation)}
                    options={options}
                    getOptionLabel={getOptionLabel}
                    isOptionEqualToValue={isOptionEqualToValue}
                    onChange={(_, data) => field.onChange(data)}
                    onInputChange={(_event, newInputValue) => {
                        onChange(newInputValue);
                    }}
                    filterOptions={filterOptions || DEFAULT_FILTER_OPTIONS}
                    renderInput={renderInput}
                    renderOption={renderOption}
                />
            )}
        />
    );
}
