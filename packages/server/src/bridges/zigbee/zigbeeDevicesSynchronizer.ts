import _ from 'lodash';

import { Device } from '../../entities/deviceEntity';
import { ZigbeeDevice } from './zigbeeDefinitions';
import { ZigbeeDeviceManager } from './zigbeeDeviceManager';

export const createDeviceSynchronizer = (zigbeeDeviceManager: ZigbeeDeviceManager) => {
    const syncDevice = async (zigbeeDevice: ZigbeeDevice, devices: Device[]) => {
        const [device] = devices;

        if (devices.length === 0) {
            console.log(`Device with ieeeAddress=${zigbeeDevice.ieeeAddress} does not exist`);
            const createdDevice = await zigbeeDeviceManager.create(zigbeeDevice);
            console.log(`Created device with id ${createdDevice._id} and ieeeAddress=${createdDevice.ieeeAddress}`);
        } else if (devices.length > 1) {
            console.log(`Found multiple devices with ieeeAddress=${zigbeeDevice.ieeeAddress}`);
        } else {
            console.log(`Found device with id ${device._id} and ieeeAddress=${zigbeeDevice.ieeeAddress}`);

            const updatedDevice = await zigbeeDeviceManager.update(device, zigbeeDevice);
            if (updatedDevice._version === device._version) {
                console.log(`Device with id ${device._id} and ieeeAddress=${zigbeeDevice.ieeeAddress} has not changed`);
            } else {
                console.log(`Device with id ${device._id} and ieeeAddress=${zigbeeDevice.ieeeAddress} has changed`);
            }
        }
    };

    const syncDevices = async (zigbeeDevices: ZigbeeDevice[]) => {
        const allDevices = await zigbeeDeviceManager.searchByIeeeAddresses(zigbeeDevices.map((d) => d.ieeeAddress));

        console.log(`Found ${allDevices.length} devices`);

        await Promise.all(
            zigbeeDevices.map((zigbeeDevice) => {
                const devices = allDevices.filter((d) => d.ieeeAddress === zigbeeDevice.ieeeAddress);

                return syncDevice(zigbeeDevice, devices);
            }),
        );
    };

    return {
        syncDevices,
    };
};
