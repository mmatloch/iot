import CreateConfigurationForm from '@components/configurations/CreateConfigurationForm';
import type { DeviceProtocol } from '@definitions/entities/deviceTypes';
import { useAuth } from '@hooks/useAuth';
import { Alert, AlertTitle } from '@mui/material';
import { getConfigurationTypeByProtocol } from '@utils/configurationUtils';
import { Trans, useTranslation } from 'react-i18next';

interface Props {
    deviceProtocol: DeviceProtocol | undefined;
    onCreatedConfiguration: () => void;
}

export default function SetupBridgeConfigurationStep({ deviceProtocol, onCreatedConfiguration }: Props) {
    const { t } = useTranslation();
    const auth = useAuth();
    const isAdmin = auth?.isAdmin;

    if (deviceProtocol) {
        if (!isAdmin) {
            return (
                <Alert severity="error">
                    <AlertTitle>{t('generic:errors.permissionDenied')}</AlertTitle>
                    <Trans
                        i18nKey="configurations:errors.noPermissionToCreateConfiguration"
                        t={t}
                        components={{ strong: <strong /> }}
                    />
                </Alert>
            );
        }

        return (
            <CreateConfigurationForm
                configurationType={getConfigurationTypeByProtocol(deviceProtocol)}
                onSubmitSuccess={onCreatedConfiguration}
            />
        );
    }

    return <></>;
}
