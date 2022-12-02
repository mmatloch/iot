import { useCreateEvent } from '@api/eventsApi';
import type { EventDto} from '@definitions/entities/eventTypes';
import { EventMetadataType, EventState, EventTriggerType } from '@definitions/entities/eventTypes';
import EventEditorForm from '@features/events/components/EventEditorForm';
import Layout from '@layout/Layout';
import { Button, Container, Toolbar, Typography } from '@mui/material';
import { prepareEventDto } from '@utils/modifyEventDto';
import { useSnackbar } from 'notistack';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                runAfterEvent: null as any,
                cronExpression: '* * * * *',
                retryImmediatelyAfterBoot: false,
                recurring: false,
            },
        },
    });

    const { handleSubmit } = methods;

    const handleSave = async (eventDto: EventDto) => {
        try {
            await mutateAsync(prepareEventDto(eventDto));
            navigate(AppRoute.Events.Root);
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

                <FormProvider {...methods}>
                    <EventEditorForm />
                </FormProvider>
            </Container>
        </Layout>
    );
}
