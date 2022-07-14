import _ from 'lodash';

import { getLogger } from '../../../logger';
import { ZigbeeDevice } from '../zigbeeDefinitions';
import { ZigbeeDeviceManager } from '../zigbeeDeviceManager';
import { createDeviceSynchronizer } from '../zigbeeDevicesSynchronizer';

const logger = getLogger();

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

export const onDevicesErrorHandler = async (e: unknown) => {
    logger.error({
        msg: `An error occurred while handling devices from the Zigbee bridge`,
        err: e,
    });
};
