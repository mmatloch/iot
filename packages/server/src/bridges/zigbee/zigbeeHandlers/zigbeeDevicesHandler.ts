import _ from 'lodash';

import { ZigbeeDevice } from '../zigbeeDefinitions';
import { ZigbeeDeviceManager } from '../zigbeeDeviceManager';
import { createDeviceSynchronizer } from '../zigbeeDevicesSynchronizer';

// improve readability, until this is merged https://github.com/ajv-validator/ajv/issues/1346
const removeAdditionalProperties = (zigbeeDevices: ZigbeeDevice[]): void => {
    const propsToRemove = ['dateCode', 'endpoints', 'definition.exposes', 'definition.options'];

    zigbeeDevices.forEach((element) => {
        propsToRemove.forEach((prop) => _.unset(element, prop));
    });
};

export const createDevicesHandler = (zigbeeDeviceManager: ZigbeeDeviceManager) => {
    return async (devices: ZigbeeDevice[]) => {
        removeAdditionalProperties(devices);

        await createDeviceSynchronizer(zigbeeDeviceManager).syncDevices(devices);
    };
};

// TODO add logger
export const onDevicesErrorHandler = async (error: unknown) => {
    console.log('onDevicesErrorHandler',error);
};
