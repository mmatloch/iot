import {
    Checkbox,
    CheckboxProps,
    FormControl,
    FormControlLabel,
    FormControlLabelProps,
    FormControlProps,
} from '@mui/material';
import { useId } from 'react';
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form';

interface Props extends CheckboxProps {
    name: string;
    validation?: RegisterOptions;
    label: FormControlLabelProps['label'];
    margin: FormControlProps['margin'];
}

export default function FormCheckbox(props: Props) {
    const id = useId();

    const {
        control,
        register,
        formState: { errors },
    } = useFormContext();

    return (
        <FormControl margin={props.margin} error={!!errors[props.name]}>
            <Controller
                name={props.name}
                control={control}
                render={({ field }) => (
                    <FormControlLabel
                        label={props.label}
                        control={<Checkbox {...field} {...props} {...register(props.name, props.validation)} />}
                    ></FormControlLabel>
                )}
                defaultValue={props.defaultValue || ''}
            />
        </FormControl>
    );
}
