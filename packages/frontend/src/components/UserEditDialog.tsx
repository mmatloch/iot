import { useUpdateUser } from '@api/usersApi';
import FormInputSelect from '@components/forms/FormInputSelect';
import FormInputText from '@components/forms/FormInputText';
import { User, UserRole } from '@definitions/entities/userTypes';
import { useAuth } from '@hooks/useAuth';
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
    email?: string;
    role?: UserRole;
}

export default function UserEditDialog({ user, isOpen, onClose }: Props) {
    const auth = useAuth();
    const isAdmin = auth?.isAdmin;

    const { t } = useTranslation();
    const { mutateAsync, isLoading } = useUpdateUser(user);
    const { enqueueSnackbar } = useSnackbar();

    const methods = useForm<FormInput>();
    const { handleSubmit, reset } = methods;

    const createDefaultValues = (user: User) => {
        const values: FormInput = {
            name: user.name,
            firstName: user.firstName,
            lastName: user.lastName,
        };

        if (isAdmin) {
            values.email = user.email;
            values.role = user.role;
        }

        return values;
    };

    const resetWithDefault = (updatedUser: User = user) => reset(createDefaultValues(updatedUser));

    useEffect(() => {
        resetWithDefault(user);
    }, [user]);

    const closeDialog = () => {
        onClose();
    };

    const onSubmit = async (payload: FormInput) => {
        try {
            await mutateAsync(payload);
        } catch {
            enqueueSnackbar(t('users:errors.failedToUpdateUser'), {
                variant: 'error',
            });

            return;
        }

        closeDialog();
    };

    const roleSelectItems = [
        {
            value: UserRole.Admin,
            label: t(`users:role.${UserRole.Admin}`),
        },
        {
            value: UserRole.User,
            label: t(`users:role.${UserRole.User}`),
        },
    ];

    return (
        <Dialog open={isOpen} onClose={closeDialog}>
            <DialogTitle>
                {t('generic:edit')} {user.firstName} {user.lastName}
            </DialogTitle>
            <DialogContent>
                <FormProvider {...methods}>
                    <FormGroup sx={{ m: 1 }}>
                        {isAdmin ? (
                            <FormInputText
                                name="email"
                                label={t('users:entity.email')}
                                autoComplete="email"
                                validation={{ required: true }}
                                margin="dense"
                            />
                        ) : (
                            <></>
                        )}
                        <FormInputText
                            name="name"
                            label={t('users:entity.name')}
                            autoComplete="name"
                            validation={{ required: true }}
                            margin="dense"
                        />
                        <FormInputText
                            name="firstName"
                            label={t('users:entity.firstName')}
                            autoComplete="given-name"
                            validation={{ required: true }}
                            margin="dense"
                        />
                        <FormInputText
                            name="lastName"
                            label={t('users:entity.lastName')}
                            autoComplete="family-name"
                            validation={{ required: true }}
                            margin="dense"
                        />
                        {isAdmin ? (
                            <FormInputSelect
                                name="role"
                                label={t('users:entity.role')}
                                items={roleSelectItems}
                                validation={{ required: true }}
                                margin="dense"
                            />
                        ) : (
                            <></>
                        )}
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
