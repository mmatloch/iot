import { ConfigurationType } from '@definitions/configurationTypes';
import { DeviceProtocol } from '@definitions/deviceTypes';

export const getConfigurationTypeByProtocol = (protocol: DeviceProtocol): ConfigurationType => {
    switch (protocol) {
        case DeviceProtocol.Zigbee:
            return ConfigurationType.ZigbeeBridge;

        default: {
            throw new Error(`No configuration for '${protocol}' protocol`);
        }
    }
};
