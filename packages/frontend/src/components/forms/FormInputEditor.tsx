import Editor from '@components/editor/Editor';
import { Controller, useFormContext } from 'react-hook-form';

interface Props {
    name: string;
    language: string;
}

export default function FormInputEditor(props: Props) {
    const { control } = useFormContext();

    return <Controller name={props.name} control={control} render={({ field }) => <Editor {...field} {...props} />} />;
}
