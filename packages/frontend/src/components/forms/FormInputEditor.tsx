import Editor, { Props as EditorProps } from '@components/editor/Editor';
import { Controller, useFormContext } from 'react-hook-form';

interface Props extends EditorProps {
    name: string;
    language: string;
    filename?: string;
}

export default function FormInputEditor(props: Props) {
    const { control } = useFormContext();

    return <Controller name={props.name} control={control} render={({ field }) => <Editor {...field} {...props} />} />;
}
