import { useCreateEvent } from '@api/eventsApi';
import { EventDto, EventMetadataType, EventState, EventTriggerType } from '@definitions/entities/eventTypes';
import EventEditorActionDefinitionForm from '@features/events/components/EventEditor/EventEditorActionDefinitionForm';
import EventEditorBasicInformationForm from '@features/events/components/EventEditor/EventEditorBasicInformationForm';
import EventEditorConditionDefinitionForm from '@features/events/components/EventEditor/EventEditorConditionDefinitionForm';
import Layout from '@layout/Layout';
import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Button, Container, Toolbar, Typography } from '@mui/material';
import { enrichEventDto } from '@utils/enrichEventDto';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate } from 'react-router-dom';

import { AppRoute } from '../constants';

export default function EventCreator() {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const { mutateAsync } = useCreateEvent();

    const methods = useForm<EventDto>({
        defaultValues: {
            displayName: '',
            triggerFilters: {},
            triggerType: EventTriggerType.Api,
            actionDefinition: '',
            conditionDefinition: '',
            state: EventState.Inactive,
            metadata: {
                type: EventMetadataType.Scheduler, // There is only 1 type
                interval: 60,
                runAfterEvent: null as any,
                cronExpression: '* * * * *',
            },
        },
    });

    const { handleSubmit } = methods;

    const handleSave = async (eventDto: EventDto) => {
        try {
            const createdEvent = await mutateAsync(enrichEventDto(eventDto));
            navigate(generatePath(AppRoute.Events.Editor, { eventId: String(createdEvent._id) }));
        } catch (e) {
            enqueueSnackbar(t('events:errors.failedToCreateEvent'), {
                variant: 'error',
            });
        }
    };

    return (
        <Layout>
            <Container>
                <Toolbar sx={{ mb: 3 }}>
                    <Typography sx={{ typography: { sm: 'h4', xs: 'h5' }, flexGrow: 1 }} component="div">
                        {t('events:editor.creator.title')}
                    </Typography>

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
                    <AccordionDetails>
                        <EventEditorConditionDefinitionForm methods={methods} />
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography>{t('events:editor.actionDefinition.title')}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <EventEditorActionDefinitionForm methods={methods} />
                    </AccordionDetails>
                </Accordion>
            </Container>
        </Layout>
    );
}
