import type {
    CheckboxProps,
    FormControlLabelProps,
    FormControlProps} from '@mui/material';
import {
    Checkbox,
    FormControl,
    FormControlLabel
} from '@mui/material';
import type { RegisterOptions} from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';

interface Props extends CheckboxProps {
    name: string;
    validation?: RegisterOptions;
    label: FormControlLabelProps['label'];
    margin: FormControlProps['margin'];
}

export default function FormCheckbox(props: Props) {
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
                        control={
                            <Checkbox
                                {...field}
                                {...props}
                                {...register(props.name, props.validation)}
                                onChange={(e) => field.onChange(e.target.checked)}
                                checked={field.value}
                            />
                        }
                    ></FormControlLabel>
                )}
                defaultValue={props.defaultValue || ''}
            />
        </FormControl>
    );
}
