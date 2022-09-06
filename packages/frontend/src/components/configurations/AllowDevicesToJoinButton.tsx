import { useUpdateConfiguration } from '@api/configurationsApi';
import { Configuration } from '@definitions/configurationTypes';
import { Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    children: ReactNode;
    configuration: Configuration;
    onSuccess: () => void;
}

export default function AllowDevicesToJoinButton({ configuration, onSuccess, children }: Props) {
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();
    const { mutateAsync } = useUpdateConfiguration(configuration);

    const updateConfiguration = async () => {
        const payload = {
            data: {
                ...configuration.data,
                allowDevicesToJoin: true,
            },
        };

        try {
            await mutateAsync(payload);
            onSuccess();
        } catch (e) {
            enqueueSnackbar(t('configurations:errors.failedToUpdateConfiguration'), {
                variant: 'error',
            });
        }
    };

    return (
        <Button color="error" variant="contained" size="large" onClick={updateConfiguration}>
            {children}
        </Button>
    );
}
