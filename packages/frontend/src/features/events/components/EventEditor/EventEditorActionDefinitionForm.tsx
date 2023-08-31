import FormInputEditor from '@components/forms/FormInputEditor';
import libSdk from '@definitions/eventSdk.d.ts?raw';
import { Box, FormGroup } from '@mui/material';

export default function EventEditorActionDefinitionForm() {
    return (
        <FormGroup>
            <Box sx={{ height: 400 }}>
                <FormInputEditor
                    name="actionDefinition"
                    language="javascript"
                    filename="actionDefinition"
                    extraLib={libSdk}
                />
            </Box>
        </FormGroup>
    );
}
