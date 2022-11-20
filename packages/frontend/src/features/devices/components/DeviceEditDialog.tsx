import { useUpdateDevice } from '@api/devicesApi';
import FormInputText from '@components/forms/FormInputText';
import { Device } from '@definitions/entities/deviceTypes';
import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormGroup } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Props {
    device: Device;
    isOpen: boolean;
    onClose: () => void;
}

type FormInput = Pick<Device, 'displayName' | 'description'>;

export default function DeviceEditDialog({ device, isOpen, onClose }: Props) {
    const { t } = useTranslation();
    const { mutateAsync, isLoading } = useUpdateDevice(device);
    const { enqueueSnackbar } = useSnackbar();

    const methods = useForm<FormInput>();
    const { handleSubmit, reset } = methods;

    useEffect(() => {
        reset({
            displayName: device.displayName,
            description: device.description,
        });
    }, [device, reset]);

    const closeDialog = () => {
        onClose();
    };

    const onSubmit = async (payload: FormInput) => {
        try {
            await mutateAsync(payload);
        } catch {
            enqueueSnackbar(t('devices:errors.failedToUpdateDevice'), {
                variant: 'error',
            });

            return;
        }

        closeDialog();
    };

    return (
        <Dialog open={isOpen} onClose={closeDialog}>
            <DialogTitle>
                {t('generic:edit')} {device.displayName}
            </DialogTitle>
            <DialogContent>
                <FormProvider {...methods}>
                    <FormGroup sx={{ m: 1 }}>
                        <FormInputText
                            name="displayName"
                            label={t('devices:entity.displayName')}
                            validation={{ required: true }}
                            margin="dense"
                        />

                        <FormInputText
                            name="description"
                            label={t('devices:entity.description')}
                            validation={{ required: true }}
                            margin="dense"
                            multiline
                            maxRows={4}
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
