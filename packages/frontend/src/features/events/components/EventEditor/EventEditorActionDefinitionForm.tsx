import FormInputEditor from '@components/forms/FormInputEditor';
import { EventDto } from '@definitions/entities/eventTypes';
import { Box, FormGroup } from '@mui/material';
import { useId } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';

interface Props {
    methods: UseFormReturn<EventDto>;
}

export default function EventEditorActionDefinitionForm({ methods }: Props) {
    return (
        <FormProvider {...methods}>
            <FormGroup>
                <Box sx={{ height: 400 }}>
                    <FormInputEditor name="actionDefinition" language="javascript" filename="actionDefinition" />
                </Box>
            </FormGroup>
        </FormProvider>
    );
}
