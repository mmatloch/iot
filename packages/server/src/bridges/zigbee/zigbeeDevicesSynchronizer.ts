import { DeviceDeactivatedByType, DeviceState } from '../../definitions/deviceDefinitions';
import type { Device } from '../../entities/deviceEntity';
import { getLogger } from '../../logger';
import type { ZigbeeDevice } from './zigbeeDefinitions';
import type { ZigbeeDeviceManager } from './zigbeeDeviceManager';

const logger = getLogger();

export const createDeviceSynchronizer = (zigbeeDeviceManager: ZigbeeDeviceManager) => {
    const syncDevice = async (zigbeeDevice: ZigbeeDevice, device: Device | undefined) => {
        if (!device) {
            logger.info(`The device with ieeeAddress '${zigbeeDevice.ieeeAddress}' does not exist`);

            let createdDevice;
            try {
                createdDevice = await zigbeeDeviceManager.create(zigbeeDevice);
            } catch (e) {
                logger.error({
                    msg: `Failed to create a device with ieeeAddress '${zigbeeDevice.ieeeAddress}'`,
                    device,
                    zigbeeDevice,
                    err: e,
                });

                return;
            }

            logger.warn({
                msg: `Created a device with displayName '${createdDevice.displayName}' and ieeeAddress '${createdDevice.ieeeAddress}'`,
                device: createdDevice,
            });

            return;
        }

        logger.debug({
            msg: `Found device with displayName '${device.displayName}' and ieeeAddress '${device.ieeeAddress}'`,
            device,
        });

        if (device.state === DeviceState.Inactive) {
            if (device.deactivatedBy?.type !== DeviceDeactivatedByType.Bridge) {
                logger.debug({
                    msg: `The '${device.displayName}' device is inactive and cannot be activated by the bridge because it has been deactivated by ${device.deactivatedBy?.type}`,
                    device,
                });

                return;
            }

            logger.debug({
                msg: `The '${device.displayName}' device is inactive and will be activated by the bridge`,
                device,
            });
        }

        let updatedDevice;
        try {
            updatedDevice = await zigbeeDeviceManager.update(device, zigbeeDevice);
        } catch (e) {
            logger.error({
                msg: `Failed to update the '${device.displayName}' device`,
                device,
                err: e,
            });

            return;
        }

        if (updatedDevice._version === device._version) {
            logger.debug({
                msg: `The '${updatedDevice.displayName}' device has not changed`,
                device: updatedDevice,
            });
        } else {
            logger.warn({
                msg: `Updated the '${updatedDevice.displayName}' device`,
                device: updatedDevice,
            });
        }
    };

    const deactivateDevice = async (device: Device) => {
        if (device.state === DeviceState.Inactive) {
            return;
        }

        logger.warn({
            msg: `Deactivating the '${device.displayName}' device, as it was removed from the network`,
            device,
        });

        let updatedDevice;

        try {
            updatedDevice = await zigbeeDeviceManager.deactivate(device);
        } catch (e) {
            logger.error({
                msg: `Failed to deactivate the '${device.displayName}' device`,
                device,
                err: e,
            });

            return;
        }

        logger.debug({
            msg: `The '${updatedDevice.displayName}' device has been deactivated`,
            device: updatedDevice,
        });
    };

    const syncDevices = async (zigbeeDevices: ZigbeeDevice[]) => {
        const allDevices = await zigbeeDeviceManager.findAll();

        logger.debug(`Found ${allDevices.length} devices for synchronization`);

        const findAndRemove = (predicate: (value: Device) => unknown): Device | undefined => {
            const index = allDevices.findIndex(predicate);

            if (index >= 0) {
                const [device] = allDevices.splice(index, 1);

                return device;
            }

            return;
        };

        // Newly added and existing
        await Promise.all(
            zigbeeDevices.map((zigbeeDevice) => {
                const device = findAndRemove((d) => d.ieeeAddress === zigbeeDevice.ieeeAddress);

                return syncDevice(zigbeeDevice, device);
            }),
        );

        // Removed from the bridge
        await Promise.all(allDevices.map((device) => deactivateDevice(device)));
    };

    return {
        syncDevices,
    };
};
