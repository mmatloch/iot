import { useEvent, useUpdateEvent } from '@api/eventsApi';
import Editor, { EditorRef } from '@components/editor/Editor';
import FailedToLoadDataDialog from '@components/FailedToLoadDataDialog';
import FullScreenLoader from '@components/FullScreenLoader';
import Layout from '@layout/Layout';
import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Container, Toolbar, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

export default function EventCreator() {
    const actionDefinitionEditorRef = useRef<EditorRef>(null);

    const { t } = useTranslation();

    const [searchParams] = useSearchParams();
    const eventId = searchParams.get('eventId');
    const isEventDefined = !!eventId;

    const { data: event, isLoading, isSuccess } = useEvent(Number(eventId), { enabled: isEventDefined });
    const {} = useUpdateEvent();

    const setDefaultActionDefinition = () => {
        if (event && actionDefinitionEditorRef.current) {
            const ref = actionDefinitionEditorRef.current;

            if (!ref.getValue().length) {
                ref.setValue(event.actionDefinition);
            }
        }
    };

    useEffect(() => {
        setDefaultActionDefinition();
    }, [event]);

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (isEventDefined && !isSuccess) {
        return <FailedToLoadDataDialog />;
    }

    const onActionDefinitionSave = (value: string) => {
        console.log(value);
    };

    const onActionDefinitionEditorMount = () => {
        setDefaultActionDefinition();
    };

    return (
        <Layout>
            <Container>
                <Toolbar sx={{ mb: 3 }}>
                    <Typography sx={{ typography: { sm: 'h4', xs: 'h5' }, flexGrow: 1 }} component="div">
                        Event Creator
                    </Typography>
                </Toolbar>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography>Basic information</Typography>
                    </AccordionSummary>
                    <AccordionDetails></AccordionDetails>
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
                            onMount={onActionDefinitionEditorMount}
                        />
                    </AccordionDetails>
                </Accordion>
            </Container>
        </Layout>
    );
}
