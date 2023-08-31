import FormInputEditor from '@components/forms/FormInputEditor';
import libSdk from '@definitions/eventSdk.d.ts?raw';
import { Box, FormGroup } from '@mui/material';

export default function EventEditorConditionDefinitionForm() {
    return (
        <FormGroup>
            <Box sx={{ height: 400 }}>
                <FormInputEditor
                    name="conditionDefinition"
                    language="javascript"
                    filename="conditionDefinition"
                    extraLib={libSdk}
                />
            </Box>
        </FormGroup>
    );
}
