import { BaseTextFieldProps, TextField } from '@mui/material';
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form';

interface Props extends Omit<BaseTextFieldProps, 'name'> {
    name: string;
    validation?: RegisterOptions;
}

export default function FormInputText(props: Props) {
    const {
        control,
        register,
        formState: { errors },
    } = useFormContext();

    return (
        <Controller
            name={props.name}
            control={control}
            render={({ field }) => (
                <TextField
                    {...field}
                    {...props}
                    {...register(props.name, props.validation)}
                    error={!!errors[props.name]}
                />
            )}
        />
    );
}
