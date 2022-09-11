import { requestBridge } from '@api/bridgeApi';
import { BridgeRequestType } from '@definitions/bridgeTypes';
import { Configuration } from '@definitions/configurationTypes';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    children: ReactNode;
    configuration: Configuration;
    onSuccess: () => void;
}

export default function AllowDevicesToJoinButton({ configuration, onSuccess, children }: Props) {
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();
    const [isLoading, setLoading] = useState(false);

    const onClickHandler = async () => {
        const payload = {
            requestType: BridgeRequestType.PermitJoin,
            value: true,
            time: 300,
        };

        setLoading(true);

        try {
            await requestBridge(configuration, payload);
            onSuccess();
        } catch (e) {
            enqueueSnackbar(t('bridge:errors.failedToRequestBridge'), {
                variant: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <LoadingButton color="error" variant="contained" size="large" onClick={onClickHandler} loading={isLoading}>
            {children}
        </LoadingButton>
    );
}
