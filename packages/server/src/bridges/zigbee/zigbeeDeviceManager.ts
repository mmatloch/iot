import { EOL } from 'node:os';

import { In } from 'typeorm';

import {
    Device,
    DeviceDto,
    DevicePowerSource,
    DeviceProtocol,
    DeviceState,
    DeviceType,
} from '../../entities/deviceEntity';
import { EventTriggerType } from '../../entities/eventEntity';
import { createDevicesService } from '../../services/devicesService';
import { createEventsService } from '../../services/eventsService';
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

const buildActionDefinition = (device: Device) => {
    const code: string[] = [`const deviceId = ${device._id}`, 'await sdk.devices.createSensorData(deviceId, context)'];

    return code.join(`; ${EOL}`);
};

const buildConditionDefinition = () => {
    const code: string[] = ['return true'];

    return code.join(`; ${EOL}`);
};

type WatchCallback = (device: Device) => Promise<void>;

export interface ZigbeeDeviceManager {
    create: (zigbeeDevice: ZigbeeDevice) => Promise<Device>;
    update: (existingDevice: Device, zigbeeDevice: ZigbeeDevice) => Promise<Device>;
    searchByIeeeAddresses: (ieeeAddresses: string[]) => Promise<Device[]>;
    watch: (cb: WatchCallback) => void;
    build: (zigbeeDevice: ZigbeeDevice) => DeviceDto;
}

export const createZigbeeDeviceManager = (): ZigbeeDeviceManager => {
    const watchCallbacks: Set<WatchCallback> = new Set();
    const devicesService = createDevicesService();
    const eventsService = createEventsService();

    const create = async (zigbeeDevice: ZigbeeDevice) => {
        const device = await devicesService.create(build(zigbeeDevice));
        await eventsService.create({
            displayName: `Incoming device data - ${device.ieeeAddress}`,
            name: `${EventTriggerType.IncomingDeviceData}_${device.ieeeAddress}`,
            triggerType: EventTriggerType.IncomingDeviceData,
            triggerFilters: {
                ieeeAddress: device.ieeeAddress,
            },
            actionDefinition: buildActionDefinition(device),
            conditionDefinition: buildConditionDefinition(),
        });

        setImmediate(() => triggerWatch(device));

        return device;
    };

    const update = async (existingDevice: Device, zigbeeDevice: ZigbeeDevice) => {
        const device = await devicesService.update(existingDevice, build(zigbeeDevice));

        setImmediate(() => triggerWatch(device));

        return device;
    };

    const searchByIeeeAddresses = async (ieeeAddresses: string[]): Promise<Device[]> => {
        const { _hits } = await devicesService.search({
            ieeeAddress: In(ieeeAddresses),
        });

        return _hits;
    };

    const triggerWatch = (device: Device) => {
        watchCallbacks.forEach((cb) => cb(device));
    };

    const watch = (cb: WatchCallback): void => {
        watchCallbacks.add(cb);
    };

    const build = (zigbeeDevice: ZigbeeDevice): DeviceDto => {
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

    return {
        create,
        update,
        searchByIeeeAddresses,
        watch,
        build,
    };
};
