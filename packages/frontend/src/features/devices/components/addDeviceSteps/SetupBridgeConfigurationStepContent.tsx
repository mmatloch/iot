import CreateConfigurationForm from '@components/configurations/CreateConfigurationForm';
import { DeviceProtocol } from '@definitions/deviceTypes';
import { useAuth } from '@hooks/useAuth';
import { Alert, AlertTitle } from '@mui/material';
import { getConfigurationTypeByProtocol } from '@utils/configurationUtils';

interface Props {
    deviceProtocol: DeviceProtocol | undefined;
    onCreatedConfiguration: () => void;
}

export default function SetupBridgeConfigurationStepContent({ deviceProtocol, onCreatedConfiguration }: Props) {
    const auth = useAuth();
    const isAdmin = auth?.isAdmin;

    if (deviceProtocol) {
        if (!isAdmin) {
            return (
                <Alert severity="error">
                    <AlertTitle>Permission denied</AlertTitle>
                    You do not have permission to create a configuration -{' '}
                    <strong>please contact your system administrator</strong>
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
