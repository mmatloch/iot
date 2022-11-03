import { useUpdateEvent } from '@api/eventsApi';
import { Event, EventDto } from '@definitions/entities/eventTypes';
import EventEditorForm from '@features/events/components/EventEditorForm';
import Layout from '@layout/Layout';
import { LoadingButton } from '@mui/lab';
import { Container, Toolbar, Typography } from '@mui/material';
import { getChangedFields } from '@utils/entityHelpers';
import { omitGenericEntityFields } from '@utils/entityHelpers';
import { useSnackbar } from 'notistack';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Props {
    event: Event;
}

export default function EventEditor({ event }: Props) {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    const { mutateAsync, isLoading } = useUpdateEvent(event);

    const methods = useForm<EventDto>({
        defaultValues: omitGenericEntityFields(event) as any,
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

                    <LoadingButton
                        variant="contained"
                        color="success"
                        sx={{ ml: 1 }}
                        onClick={handleSubmit(handleSave)}
                        loading={isLoading}
                    >
                        {t('generic:save')}
                    </LoadingButton>
                </Toolbar>

                <FormProvider {...methods}>
                    <EventEditorForm />
                </FormProvider>
            </Container>
        </Layout>
    );
}
