import FormInputEditor from '@components/forms/FormInputEditor';
import { EventDto } from '@definitions/entities/eventTypes';
import { Box, FormGroup } from '@mui/material';
import { FormProvider, UseFormReturn } from 'react-hook-form';

interface Props {
    methods: UseFormReturn<EventDto>;
}

export default function EventEditorConditionDefinitionForm({ methods }: Props) {
    return (
        <FormProvider {...methods}>
            <FormGroup>
                <Box sx={{ height: 400 }}>
                    <FormInputEditor name="conditionDefinition" language="javascript" filename="conditionDefinition" />
                </Box>
            </FormGroup>
        </FormProvider>
    );
}
