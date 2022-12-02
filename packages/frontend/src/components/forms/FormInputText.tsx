import type { BaseTextFieldProps} from '@mui/material';
import { TextField } from '@mui/material';
import type { RegisterOptions} from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';

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
