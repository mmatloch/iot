import Editor, { EditorRef } from '@components/editor/Editor';
import { EventDto, EventTriggerType } from '@definitions/entities/eventTypes';
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
            displayName: '',
            triggerFilters: {},
            triggerType: EventTriggerType.Api,
            metadata: {
                interval: 60,
                runAfterEvent: null as any,
                cronExpression: '* * * * *',
            },
        },
    });

    const { handleSubmit } = methods;

    const onActionDefinitionSave = (value: string) => {
        console.log(value);
    };

    const handleSave = (eventDto: EventDto) => {
        console.log(eventDto);
    };
    const handleClear = useCallback(() => {}, []);

    return (
        <Layout>
            <Container>
                <Toolbar sx={{ mb: 3 }}>
                    <Typography sx={{ typography: { sm: 'h4', xs: 'h5' }, flexGrow: 1 }} component="div">
                        Event Creator
                    </Typography>

                    <Button variant="contained" color="warning" onClick={handleClear}>
                        {t('generic:clear')}
                    </Button>
                    <Button variant="contained" color="success" sx={{ ml: 1 }} onClick={handleSubmit(handleSave)}>
                        {t('generic:save')}
                    </Button>
                </Toolbar>

                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography>{t('events:editor.basicInformation.title')}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <EventEditorBasicInformationForm methods={methods} />
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography>{t('events:editor.conditionDefinition.title')}</Typography>
                    </AccordionSummary>
                    <AccordionDetails></AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography>{t('events:editor.actionDefinition.title')}</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ height: 400 }}>
                        <Editor
                            ref={actionDefinitionEditorRef}
                            defaultValue=""
                            onSave={onActionDefinitionSave}
                            formatOnSave
                            language="javascript"
                        />
                    </AccordionDetails>
                </Accordion>
            </Container>
        </Layout>
    );
}
