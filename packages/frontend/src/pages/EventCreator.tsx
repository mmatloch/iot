import Editor, { EditorRef } from '@components/editor/Editor';
import { EventDto } from '@definitions/entities/eventTypes';
import EventEditorBasicInformationForm from '@features/events/components/EventEditor/EventEditorBasicInformationForm';
import Layout from '@layout/Layout';
import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Button, Container, Toolbar, Typography } from '@mui/material';
import { useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export default function EventCreator() {
    const actionDefinitionEditorRef = useRef<EditorRef>(null);

    const { t } = useTranslation();

    const methods = useForm<EventDto>({
        defaultValues: {
            metadata: {
                runAfterEvent: null as any,
            },
        },
    });

    const onActionDefinitionSave = (value: string) => {
        console.log(value);
    };

    const handleSave = useCallback(() => {}, []);
    const handleClear = useCallback(() => {}, []);

    return (
        <Layout>
            <Container>
                <Toolbar sx={{ mb: 3 }}>
                    <Typography sx={{ typography: { sm: 'h4', xs: 'h5' }, flexGrow: 1 }} component="div">
                        Event Creator
                    </Typography>

                    <Button variant="contained" color="warning" onClick={handleClear}>
                        Clear
                    </Button>
                    <Button variant="contained" color="success" sx={{ ml: 1 }} onClick={handleClear}>
                        Save
                    </Button>
                </Toolbar>

                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography>Basic information</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <EventEditorBasicInformationForm methods={methods} />
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography>Trigger options</Typography>
                    </AccordionSummary>
                    <AccordionDetails></AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography>Condition definition</Typography>
                    </AccordionSummary>
                    <AccordionDetails></AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography>Action definition</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ height: 400 }}>
                        <Editor
                            ref={actionDefinitionEditorRef}
                            editorName="ActionDefinition"
                            defaultValue=""
                            onSave={onActionDefinitionSave}
                            formatOnSave
                        />
                    </AccordionDetails>
                </Accordion>
            </Container>
        </Layout>
    );
}
