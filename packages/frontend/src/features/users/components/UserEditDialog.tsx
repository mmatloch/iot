import { useUpdateUser } from '@api/usersApi';
import FormInputText from '@components/forms/FormInputText';
import { User } from '@definitions/userTypes';
import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormGroup } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Props {
    user: User;
    isOpen: boolean;
    onClose: () => void;
}

interface FormInput {
    name: string;
    firstName: string;
    lastName: string;
}

const createDefaultValues = (user: User) => ({
    name: user.name,
    firstName: user.firstName,
    lastName: user.lastName,
});

export default function UserEditDialog({ user, isOpen, onClose }: Props) {
    const { t } = useTranslation();
    const { mutateAsync, isLoading } = useUpdateUser(user);
    const { enqueueSnackbar } = useSnackbar();

    const methods = useForm<FormInput>();
    const { handleSubmit, reset } = methods;

    const resetWithDefault = (updatedUser: User = user) => reset(createDefaultValues(updatedUser));

    useEffect(() => {
        resetWithDefault(user);
    }, [user]);

    const closeDialog = () => {
        onClose();
    };

    const onSubmit = async (payload: FormInput) => {
        try {
            const updatedUser = await mutateAsync(payload);
            resetWithDefault(updatedUser);
            closeDialog();
        } catch {
            enqueueSnackbar(t('users:errors.failedToUpdateUser'), {
                variant: 'error',
            });
        }
    };

    return (
        <Dialog open={isOpen} onClose={closeDialog}>
            <DialogTitle>
                {t('generic:edit')} {user.firstName} {user.lastName}
            </DialogTitle>
            <DialogContent>
                <FormProvider {...methods}>
                    <FormGroup sx={{ m: 1, '& .MuiTextField-root': { m: 1 } }}>
                        <FormInputText
                            name="name"
                            label={t('users:entity.name')}
                            autoComplete="name"
                            validation={{ required: true }}
                        />
                        <FormInputText
                            name="firstName"
                            label={t('users:entity.firstName')}
                            autoComplete="given-name"
                            validation={{ required: true }}
                        />
                        <FormInputText
                            name="lastName"
                            label={t('users:entity.lastName')}
                            autoComplete="family-name"
                            validation={{ required: true }}
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
