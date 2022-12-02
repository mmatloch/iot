import { useUpdateEvent } from '@api/eventsApi';
import FormInputText from '@components/forms/FormInputText';
import type { Event } from '@definitions/entities/eventTypes';
import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormGroup } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Props {
    event: Event;
    isOpen: boolean;
    onClose: () => void;
}

interface FormInput {
    displayName: string;
}

export default function EventEditDialog({ event, isOpen, onClose }: Props) {
    const { t } = useTranslation();
    const { mutateAsync, isLoading } = useUpdateEvent(event);
    const { enqueueSnackbar } = useSnackbar();

    const methods = useForm<FormInput>();
    const { handleSubmit, reset } = methods;

    useEffect(() => {
        reset({
            displayName: event.displayName,
        });
    }, [event, reset]);

    const closeDialog = () => {
        onClose();
    };

    const onSubmit = async (payload: FormInput) => {
        try {
            await mutateAsync(payload);
        } catch {
            enqueueSnackbar(t('events:errors.failedToUpdateEvent'), {
                variant: 'error',
            });

            return;
        }

        closeDialog();
    };

    return (
        <Dialog open={isOpen} onClose={closeDialog}>
            <DialogTitle>
                {t('generic:edit')} {event.displayName}
            </DialogTitle>
            <DialogContent>
                <FormProvider {...methods}>
                    <FormGroup sx={{ m: 1 }}>
                        <FormInputText
                            name="displayName"
                            label={t('events:entity.displayName')}
                            validation={{ required: true }}
                            margin="dense"
                        />
                    </FormGroup>
                </FormProvider>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog}>{t('generic:cancel')}</Button>
                <LoadingButton onClick={handleSubmit(onSubmit)} loading={isLoading} variant="contained">
                    {t('generic:save')}
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
}
