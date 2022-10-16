import { useEvent, useUpdateEvent } from '@api/eventsApi';
import Editor, { EditorRef } from '@components/editor/Editor';
import FailedToLoadDataDialog from '@components/FailedToLoadDataDialog';
import FullScreenLoader from '@components/FullScreenLoader';
import Layout from '@layout/Layout';
import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Container, Toolbar, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

export default function EventEditor() {
    const { eventId: eventIdFromParam } = useParams();
    const eventId = Number(eventIdFromParam);

    const { data: event, isLoading, isSuccess } = useEvent(eventId);
    const { mutateAsync: updateEvent } = useUpdateEvent(eventId);

    const actionDefinitionEditorRef = useRef<EditorRef>(null);
    const { enqueueSnackbar } = useSnackbar();

    const { t } = useTranslation();

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

    if (!isSuccess) {
        return <FailedToLoadDataDialog />;
    }

    const onActionDefinitionSave = async (value: string) => {
        try {
            await updateEvent({
                actionDefinition: value,
            });
        } catch {
            enqueueSnackbar(t('events:errors.failedToUpdateEvent'), {
                variant: 'error',
            });
        }
    };

    const onActionDefinitionEditorMount = () => {
        setDefaultActionDefinition();
    };

    return (
        <Layout>
            <Container>
                <Toolbar sx={{ mb: 3 }}>
                    <Typography sx={{ typography: { sm: 'h4', xs: 'h5' }, flexGrow: 1 }} component="div">
                        Event Editor
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
                            defaultValue=""
                            onSave={onActionDefinitionSave}
                            formatOnSave
                            onMount={onActionDefinitionEditorMount}
                            language="javascript"
                        />
                    </AccordionDetails>
                </Accordion>
            </Container>
        </Layout>
    );
}
