import { ConfigurationType } from '@definitions/entities/configurationTypes';

import CreateZigbeeBridgeConfigurationForm from './CreateZigbeeBridgeConfigurationForm';

interface Props {
    configurationType: ConfigurationType;
    onSubmitSuccess: () => void;
}

export default function CreateConfigurationForm({ configurationType, onSubmitSuccess }: Props) {
    switch (configurationType) {
        case ConfigurationType.ZigbeeBridge: {
            return <CreateZigbeeBridgeConfigurationForm onSubmitSuccess={onSubmitSuccess} />;
        }
    }
}
