import { GenericEntity } from './commonTypes';

export enum ConfigurationState {
    Active = 'ACTIVE',
    Inactive = 'INACTIVE',
}

export enum ConfigurationType {
    ZigbeeBridge = 'ZIGBEE_BRIDGE',
}

interface ZigbeeBridgeConfiguration {
    type: ConfigurationType.ZigbeeBridge;
    topicPrefix: string;
    permitDevicesJoin: boolean;
    permitDevicesJoinTimeout?: string;
}

export type ConfigurationDto = {
    state: ConfigurationState;
    data: ZigbeeBridgeConfiguration;
};

export type Configuration = ConfigurationDto & GenericEntity;
