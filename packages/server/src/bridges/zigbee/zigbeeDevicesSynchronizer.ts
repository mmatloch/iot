import _ from 'lodash';
import { In } from 'typeorm';

import {
    Device,
    DeviceDto,
    DevicePowerSource,
    DeviceProtocol,
    DeviceState,
    DeviceType,
} from '../../entities/deviceEntity';
import { createDevicesService } from '../../services/devicesService';
import { ZigbeeDevice, ZigbeeDeviceType, ZigbeePowerSource } from './zigbeeDefinitions';
import { getZigbeeInfo } from './zigbeeInfo';

const buildDeviceType = (zigbeeType: ZigbeeDeviceType): DeviceType => {
    switch (zigbeeType) {
        case ZigbeeDeviceType.EndDevice:
        case ZigbeeDeviceType.GreenPower:
            return DeviceType.EndDevice;

        case ZigbeeDeviceType.Router:
            return DeviceType.Router;

        default:
            return DeviceType.Unknown;
    }
};
const buildDevicePowerSource = (zigbeePowerSource: ZigbeePowerSource): DevicePowerSource => {
    switch (zigbeePowerSource) {
        case ZigbeePowerSource.Battery:
            return DevicePowerSource.Battery;

        case ZigbeePowerSource.Dc:
            return DevicePowerSource.Dc;

        case ZigbeePowerSource.MainsSinglePhase:
            return DevicePowerSource.MainsSinglePhase;

        case ZigbeePowerSource.MainsThreePhase:
            return DevicePowerSource.MainsThreePhase;

        case ZigbeePowerSource.EmergencyMainsAndTransferSwitch:
        case ZigbeePowerSource.EmergencyMainsConstPowered:
            return DevicePowerSource.EmergencyMains;

        default:
            return DevicePowerSource.Unknown;
    }
};

const buildDevice = (zigbeeDevice: ZigbeeDevice): DeviceDto => {
    if (zigbeeDevice.type === ZigbeeDeviceType.Coordinator) {
        const bridgeInfo = getZigbeeInfo();

        return {
            type: DeviceType.Coordinator,
            displayName: zigbeeDevice.friendlyName,
            description: 'Coordinator',
            ieeeAddress: zigbeeDevice.ieeeAddress,
            state: DeviceState.Unconfigured,
            protocol: DeviceProtocol.Zigbee,
            model: bridgeInfo?.coordinator.type || 'Unknown',
            vendor: 'Unknown',
            powerSource: DevicePowerSource.Dc,
        };
    } else {
        return {
            type: buildDeviceType(zigbeeDevice.type),
            displayName: zigbeeDevice.friendlyName,
            description: zigbeeDevice.definition.description,
            ieeeAddress: zigbeeDevice.ieeeAddress,
            state: DeviceState.Unconfigured,
            protocol: DeviceProtocol.Zigbee,
            model: zigbeeDevice.definition.model,
            vendor: zigbeeDevice.definition.vendor,
            powerSource: buildDevicePowerSource(zigbeeDevice.powerSource),
        };
    }
};

export const createDeviceSynchronizer = () => {
    const devicesService = createDevicesService();

    const createDevice = async (zigbeeDevice: ZigbeeDevice) => {
        return devicesService.create(buildDevice(zigbeeDevice));
    };

    const updateDevice = (existingDevice: Device, zigbeeDevice: ZigbeeDevice) => {
        const dto = buildDevice(zigbeeDevice);

        return devicesService.update(existingDevice, dto);
    };

    const syncDevice = async (zigbeeDevice: ZigbeeDevice, devices: Device[]) => {
        const [device] = devices;

        if (devices.length === 0) {
            console.log(`Device with ieeeAddress=${zigbeeDevice.ieeeAddress} does not exist`);
            const createdDevice = await createDevice(zigbeeDevice);
            console.log(`Created device with id ${createdDevice._id} and ieeeAddress=${createdDevice.ieeeAddress}`);
        } else if (devices.length > 1) {
            console.log(`Found multiple devices with ieeeAddress=${zigbeeDevice.ieeeAddress}`);
        } else {
            console.log(`Found device with id ${device._id} and ieeeAddress=${zigbeeDevice.ieeeAddress}`);

            const updatedDevice = await updateDevice(device, zigbeeDevice);
            if (updatedDevice._version === device._version) {
                console.log(`Device with id ${device._id} and ieeeAddress=${zigbeeDevice.ieeeAddress} has not changed`);
            } else {
                console.log(`Device with id ${device._id} and ieeeAddress=${zigbeeDevice.ieeeAddress} has changed`);
            }
        }
    };

    const syncDevices = async (zigbeeDevices: ZigbeeDevice[]) => {
        const { _hits: allDevices } = await devicesService.search({
            ieeeAddress: In(zigbeeDevices.map((d) => d.ieeeAddress)),
        });

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
