import { ConfigurationType } from '@definitions/entities/configurationTypes';
import { DeviceProtocol } from '@definitions/entities/deviceTypes';

export const getConfigurationTypeByProtocol = (protocol: DeviceProtocol): ConfigurationType => {
    switch (protocol) {
        case DeviceProtocol.Zigbee:
            return ConfigurationType.ZigbeeBridge;

        default: {
            throw new Error(`No configuration for '${protocol}' protocol`);
        }
    }
};
