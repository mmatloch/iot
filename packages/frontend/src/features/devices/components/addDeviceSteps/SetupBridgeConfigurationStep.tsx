import CreateConfigurationForm from '@components/configurations/CreateConfigurationForm';
import type { DeviceProtocol } from '@definitions/entities/deviceTypes';
import { getConfigurationTypeByProtocol } from '@utils/configurationUtils';

interface Props {
    deviceProtocol: DeviceProtocol | undefined;
    onCreatedConfiguration: () => void;
}

export default function SetupBridgeConfigurationStep({ deviceProtocol, onCreatedConfiguration }: Props) {
    if (deviceProtocol) {
        return (
            <CreateConfigurationForm
                configurationType={getConfigurationTypeByProtocol(deviceProtocol)}
                onSubmitSuccess={onCreatedConfiguration}
            />
        );
    }

    return <></>;
}
