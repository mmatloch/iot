import { useUpdateEvent } from '@api/eventsApi';
import { Event, EventDto, EventState } from '@definitions/entities/eventTypes';
import ActivateEventButton from '@features/events/components/ActivateEventButton';
import DeactivateEventButton from '@features/events/components/DeactivateEventButton';
import EventEditorForm from '@features/events/components/EventEditorForm';
import EventTriggerPanel from '@features/events/components/EventTriggerPanel';
import Layout from '@layout/Layout';
import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Container, Grid, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import { getChangedFields } from '@utils/entityHelpers';
import { omitGenericEntityFields } from '@utils/entityHelpers';
import { Allotment } from 'allotment';
import { useSnackbar } from 'notistack';
import { DefaultValues, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Props {
    event: Event;
}

export default function EventEditor({ event }: Props) {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    const theme = useTheme();
    const isMediumMedia = useMediaQuery(theme.breakpoints.up('sm'));

    const { mutateAsync, isLoading } = useUpdateEvent(event);

    const methods = useForm<EventDto>({
        defaultValues: omitGenericEntityFields(event) as DefaultValues<EventDto>,
    });

    const { handleSubmit } = methods;

    const handleSave = async (eventDto: EventDto) => {
        const payload = getChangedFields(omitGenericEntityFields(event), eventDto);

        try {
            await mutateAsync(payload);
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
                        {t('events:editor.editor.title')}
                    </Typography>
                </Toolbar>
            </Container>

            <Box sx={{ height: '83vh' }}>
                <Allotment defaultSizes={[5, 2]} vertical={!isMediumMedia}>
                    <Grid
                        container
                        justifyContent="center"
                        sx={{
                            overflowY: 'auto',
                            height: '83vh',
                            '&::-webkit-scrollbar': {
                                display: 'none',
                            },
                        }}
                    >
                        <Grid item sx={{ width: '80%' }}>
                            <Toolbar sx={{ mb: 3 }}>
                                <Box sx={{ flexGrow: 1 }}></Box>
                                <LoadingButton
                                    variant="contained"
                                    color="success"
                                    sx={{ mx: 1 }}
                                    onClick={handleSubmit(handleSave)}
                                    loading={isLoading}
                                    startIcon={<Save />}
                                >
                                    {t('generic:save')}
                                </LoadingButton>

                                {event.state !== EventState.Active ? (
                                    <ActivateEventButton event={event} />
                                ) : (
                                    <DeactivateEventButton event={event} />
                                )}
                            </Toolbar>

                            <FormProvider {...methods}>
                                <EventEditorForm />
                            </FormProvider>
                        </Grid>
                    </Grid>

                    <Box
                        sx={{
                            overflowY: 'auto',
                            height: '83vh',
                            '&::-webkit-scrollbar': {
                                display: 'none',
                            },
                        }}
                    >
                        <EventTriggerPanel event={event} />
                    </Box>
                </Allotment>
            </Box>
        </Layout>
    );
}
