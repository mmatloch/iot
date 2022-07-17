import { EOL } from 'node:os';

import {
    Device,
    DeviceDeactivatedByType,
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

const buildDeviceState = (zigbeeDevice: ZigbeeDevice): DeviceState => {
    if (zigbeeDevice.interviewing) {
        return DeviceState.Interviewing;
    }

    if (zigbeeDevice.interviewCompleted) {
        return DeviceState.Unconfigured;
    }

    return DeviceState.New;
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
    deactivate: (device: Device) => Promise<void>;
    update: (existingDevice: Device, zigbeeDevice: ZigbeeDevice) => Promise<Device>;
    findAll: () => Promise<Device[]>;
    watch: (cb: WatchCallback) => void;
}

export const createZigbeeDeviceManager = (): ZigbeeDeviceManager => {
    const watchCallbacks: Set<WatchCallback> = new Set();
    const devicesService = createDevicesService();
    const eventsService = createEventsService();

    const create: ZigbeeDeviceManager['create'] = async (zigbeeDevice) => {
        const device = await devicesService.create(buildToCreate(zigbeeDevice));
        await eventsService.create({
            displayName: `Incoming device data - ${device.ieeeAddress}`,
            name: `${EventTriggerType.IncomingDeviceData}_${device.ieeeAddress}`,
            triggerType: EventTriggerType.IncomingDeviceData,
            triggerFilters: {
                deviceId: device._id,
            },
            actionDefinition: buildActionDefinition(device),
            conditionDefinition: buildConditionDefinition(),
        });

        setImmediate(() => triggerWatch(device));

        return device;
    };

    const update: ZigbeeDeviceManager['update'] = async (existingDevice, zigbeeDevice) => {
        const newDevice = buildToUpdate(zigbeeDevice);

        if (existingDevice.state === DeviceState.Inactive) {
            newDevice.state = buildDeviceState(zigbeeDevice);
        }

        const device = await devicesService.update(existingDevice, newDevice);

        setImmediate(() => triggerWatch(device));

        return device;
    };

    const findAll: ZigbeeDeviceManager['findAll'] = async () => {
        const { _hits } = await devicesService.search({
            protocol: DeviceProtocol.Zigbee,
        });

        return _hits;
    };

    const triggerWatch = (device: Device) => {
        watchCallbacks.forEach((cb) => cb(device));
    };

    const watch: ZigbeeDeviceManager['watch'] = (cb) => {
        watchCallbacks.add(cb);
    };

    const buildToCreate = (zigbeeDevice: ZigbeeDevice): DeviceDto => {
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
                manufacturer: 'Unknown',
                powerSource: DevicePowerSource.Dc,
            };
        } else {
            return {
                type: buildDeviceType(zigbeeDevice.type),
                displayName: zigbeeDevice.friendlyName,
                description: zigbeeDevice.definition.description,
                ieeeAddress: zigbeeDevice.ieeeAddress,
                state: buildDeviceState(zigbeeDevice),
                protocol: DeviceProtocol.Zigbee,
                model: zigbeeDevice.definition.model,
                vendor: zigbeeDevice.definition.vendor,
                manufacturer: zigbeeDevice.manufacturer,
                powerSource: buildDevicePowerSource(zigbeeDevice.powerSource),
            };
        }
    };

    const buildToUpdate = (zigbeeDevice: ZigbeeDevice): Partial<DeviceDto> => {
        if (zigbeeDevice.type === ZigbeeDeviceType.Coordinator) {
            const bridgeInfo = getZigbeeInfo();

            return {
                model: bridgeInfo?.coordinator.type || 'Unknown',
                state: buildDeviceState(zigbeeDevice),
            };
        } else {
            return {
                type: buildDeviceType(zigbeeDevice.type),
                model: zigbeeDevice.definition.model,
                vendor: zigbeeDevice.definition.vendor,
                manufacturer: zigbeeDevice.manufacturer,
                powerSource: buildDevicePowerSource(zigbeeDevice.powerSource),
                state: buildDeviceState(zigbeeDevice),
            };
        }
    };

    const deactivate: ZigbeeDeviceManager['deactivate'] = async (device) => {
        await devicesService.update(device, {
            state: DeviceState.Inactive,
            deactivatedBy: {
                type: DeviceDeactivatedByType.Bridge,
                name: 'Zigbee',
            },
        });
    };

    return {
        create,
        update,
        findAll,
        watch,
        deactivate,
    };
};
