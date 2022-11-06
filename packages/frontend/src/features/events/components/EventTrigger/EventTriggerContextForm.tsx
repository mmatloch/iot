import FormInputEditor from '@components/forms/FormInputEditor';
import { Box, FormGroup, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const EDITOR_OPTIONS = {
    scrollbar: {
        useShadows: false,
        vertical: 'hidden' as const,
        horizontal: 'hidden' as const,
        verticalScrollbarSize: 0,
        horizontalScrollbarSize: 0,
    },
};

export default function EventTriggerContextForm() {
    const { t } = useTranslation();

    return (
        <FormGroup>
            <Box sx={{ mb: 1 }}>
                <Typography variant="h6">{t('events:editor.triggerPanel.context.title')}</Typography>
                <Typography variant="caption">{t('events:editor.triggerPanel.context.description')}</Typography>
            </Box>

            <Box sx={{ height: 150 }}>
                <FormInputEditor
                    name="context"
                    language="json"
                    filename="triggerContext"
                    editorOptions={EDITOR_OPTIONS}
                />
            </Box>
        </FormGroup>
    );
}
