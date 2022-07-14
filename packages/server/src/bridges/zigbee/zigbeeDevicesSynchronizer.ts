import _ from 'lodash';

import { Device } from '../../entities/deviceEntity';
import { getLogger } from '../../logger';
import { ZigbeeDevice } from './zigbeeDefinitions';
import { ZigbeeDeviceManager } from './zigbeeDeviceManager';

const logger = getLogger();

export const createDeviceSynchronizer = (zigbeeDeviceManager: ZigbeeDeviceManager) => {
    const syncDevice = async (zigbeeDevice: ZigbeeDevice, device: Device | undefined) => {
        if (!device) {
            logger.info(`The device with ieeeAddress '${zigbeeDevice.ieeeAddress}' does not exist`);

            const createdDevice = await zigbeeDeviceManager.create(zigbeeDevice);

            logger.warn({
                msg: `Created a device with ieeeAddress '${createdDevice.ieeeAddress}'`,
                device: createdDevice,
            });
            return;
        }

        logger.debug({
            msg: `Found device with ieeeAddress '${device.ieeeAddress}'`,
            device,
        });

        const updatedDevice = await zigbeeDeviceManager.update(device, zigbeeDevice);
        if (updatedDevice._version === device._version) {
            logger.debug({
                msg: `The device with ieeeAddress '${updatedDevice.ieeeAddress}' has not changed`,
                device,
            });
        } else {
            logger.warn({
                msg: `Updated the device with ieeeAddress '${updatedDevice.ieeeAddress}'`,
                device,
            });
        }
    };

    const syncDevices = async (zigbeeDevices: ZigbeeDevice[]) => {
        const allDevices = await zigbeeDeviceManager.searchByIeeeAddresses(zigbeeDevices.map((d) => d.ieeeAddress));

        logger.debug(`Found ${allDevices.length} devices for synchronization`);

        await Promise.all(
            zigbeeDevices.map((zigbeeDevice) => {
                const device = allDevices.find((d) => d.ieeeAddress === zigbeeDevice.ieeeAddress);

                return syncDevice(zigbeeDevice, device);
            }),
        );
    };

    return {
        syncDevices,
    };
};
