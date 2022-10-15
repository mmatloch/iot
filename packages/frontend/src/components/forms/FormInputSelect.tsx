import { FormControl, InputLabel, MenuItem, Select, SelectProps } from '@mui/material';
import { useId, useMemo } from 'react';
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form';

interface SelectItem {
    value: string | number;
    label: string;
}

interface Props extends Omit<SelectProps, 'name'> {
    name: string;
    validation?: RegisterOptions;
    items: SelectItem[];
}

export default function FormInputSelect(props: Props) {
    const id = useId();

    const {
        control,
        register,
        formState: { errors },
    } = useFormContext();

    const items = useMemo(
        () =>
            props.items.map((item, index) => (
                <MenuItem key={index} value={item.value}>
                    {item.label}
                </MenuItem>
            )),
        [props.items],
    );

    return (
        <FormControl margin={props.margin}>
            <InputLabel id={id}>{props.label}</InputLabel>

            <Controller
                name={props.name}
                control={control}
                render={({ field }) => (
                    <Select
                        {...field}
                        {...props}
                        {...register(props.name, props.validation)}
                        error={!!errors[props.name]}
                        labelId={id}
                    >
                        {items}
                    </Select>
                )}
                defaultValue={props.defaultValue || ''}
            />
        </FormControl>
    );
}
