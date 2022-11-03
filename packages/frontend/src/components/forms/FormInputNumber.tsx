import { BaseTextFieldProps, TextField } from '@mui/material';
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form';

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
                    error={!!errors[props.name]}
                />
            )}
        />
    );
}
