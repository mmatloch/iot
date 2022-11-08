import { useRequestBridge } from '@api/bridgeApi';
import { BridgeRequestType } from '@definitions/bridgeTypes';
import { Configuration } from '@definitions/entities/configurationTypes';
import { LoadingButton } from '@mui/lab';
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
    const { mutateAsync, isLoading } = useRequestBridge(configuration);

    const onClickHandler = async () => {
        const payload = {
            requestType: BridgeRequestType.PermitJoin,
            value: true,
            time: 300,
        };

        try {
            await mutateAsync(payload);
            onSuccess();
        } catch (e) {
            enqueueSnackbar(t('bridge:errors.failedToRequestBridge'), {
                variant: 'error',
            });
        }
    };

    return (
        <LoadingButton color="error" variant="contained" size="large" onClick={onClickHandler} loading={isLoading}>
            {children}
        </LoadingButton>
    );
}
