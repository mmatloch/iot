import { useTriggerEvent } from '@api/eventsApi';
import CircularProgressLoader from '@components/CircularProgressLoader';
import type { Event} from '@definitions/entities/eventTypes';
import { EventActionOnInactive } from '@definitions/entities/eventTypes';
import type { EventsTriggerPayload } from '@definitions/eventTriggerTypes';
import { Send } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Divider, Toolbar } from '@mui/material';
import { useSnackbar } from 'notistack';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import EventTriggerContextForm from './EventTrigger/EventTriggerContextForm';
import EventTriggerOptionsForm from './EventTrigger/EventTriggerOptionsForm';
import EventTriggerResultPanel from './EventTrigger/EventTriggerResultPanel';

interface Props {
    event: Event;
}

interface FormInput {
    context: string;
    options: EventsTriggerPayload['options'];
}

export default function EventTriggerPanel({ event }: Props) {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    const { mutate, isLoading, data, error } = useTriggerEvent();

    const methods = useForm<FormInput>({
        defaultValues: {
            context: '{}',
            options: {
                onInactive: EventActionOnInactive.Error,
            },
        },
    });

    const { handleSubmit } = methods;

    const handleTrigger = async (formInput: FormInput) => {
        let parsedContext;

        try {
            parsedContext = JSON.parse(formInput.context);
        } catch {
            enqueueSnackbar(t('events:errors.failedToParseTriggerContext'), {
                variant: 'error',
            });

            return;
        }

        const payload = {
            filters: {
                triggerFilters: event.triggerFilters,
                triggerType: event.triggerType,
            },
            ...formInput,
            context: parsedContext,
        };

        mutate(payload);
    };

    return (
        <Box>
            <Toolbar sx={{ mb: 3 }}>
                <LoadingButton
                    variant="contained"
                    onClick={handleSubmit(handleTrigger)}
                    loading={isLoading}
                    startIcon={<Send />}
                >
                    {t('events:editor.triggerPanel.buttonText')}
                </LoadingButton>
            </Toolbar>

            <Box sx={{ ml: 3 }}>
                <FormProvider {...methods}>
                    <Box sx={{ mb: 1 }}>
                        <EventTriggerContextForm />
                    </Box>

                    <EventTriggerOptionsForm />
                </FormProvider>

                <Divider sx={{ my: 2 }} />

                {isLoading ? (
                    <CircularProgressLoader variant="center" />
                ) : (
                    <EventTriggerResultPanel data={data} error={error} />
                )}
            </Box>
        </Box>
    );
}
