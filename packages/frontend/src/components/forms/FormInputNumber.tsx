import { useFormErrorTranslation } from '@hooks/useFormErrorTranslation';
import type { BaseTextFieldProps } from '@mui/material';
import { TextField } from '@mui/material';
import { RegisterOptions, get } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';

interface Props extends Omit<BaseTextFieldProps, 'name'> {
    name: string;
    validation?: RegisterOptions;
}

export default function FormInputNumber(props: Props) {
    const {
        control,
        register,
        formState: { errors },
    } = useFormContext();

    const error = get(errors, props.name);
    const hasError = !!error;
    const errorMessage = useFormErrorTranslation(error);
    const helperText = errorMessage || props.helperText;

    return (
        <Controller
            name={props.name}
            control={control}
            render={({ field }) => (
                <TextField
                    type="number"
                    {...field}
                    {...props}
                    {...register(props.name, {
                        ...props.validation,
                        valueAsNumber: true,
                    })}
                    error={hasError}
                    helperText={helperText}
                />
            )}
        />
    );
}
