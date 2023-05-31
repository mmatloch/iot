import { EOL } from 'node:os';

import { get, set } from 'lodash';

import {
    DeviceDeactivatedByType,
    DevicePowerSource,
    DeviceProtocol,
    DeviceState,
    DeviceType,
} from '../../definitions/deviceDefinitions';
import { EventState, EventTriggerType } from '../../definitions/eventDefinitions';
import type { Device, DeviceDto } from '../../entities/deviceEntity';
import { DeviceFeatureType, DeviceFeatureUnit } from '../../entities/deviceFeatureEntity';
import { getLogger } from '../../logger';
import { createDevicesService } from '../../services/devicesService';
import { createEventsService } from '../../services/eventsService';
import { isSomeEnum } from '../../utils/isSomeEnum';
import type { ZigbeeDevice, ZigbeeDeviceFeature } from './zigbeeDefinitions';
import { ZigbeeDeviceType, ZigbeePowerSource } from './zigbeeDefinitions';
import { getZigbeeInfo } from './zigbeeInfo';

const logger = getLogger();

const isDeviceFeatureUnit = isSomeEnum(DeviceFeatureUnit);
const isDeviceFeatureType = isSomeEnum(DeviceFeatureType);

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
        return DeviceState.Active;
    }

    return DeviceState.New;
};

const buildActionDefinition = (device: Device) => {
    const code: string[] = [
        `const deviceId = ${device._id}`,
        'const device = await sdk.devices.findByIdOrFail(deviceId)',
        'await sdk.devices.createSensorData(device, context)',
    ];

    return code.join(`; ${EOL}`);
};

const buildConditionDefinition = () => {
    const code: string[] = ['return true'];

    return code.join(`; ${EOL}`);
};

type WatchCallback = (device: Device) => Promise<void>;

export interface ZigbeeDeviceManager {
    create: (zigbeeDevice: ZigbeeDevice) => Promise<Device>;
    deactivate: (device: Device) => Promise<Device>;
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
            triggerType: EventTriggerType.IncomingDeviceData,
            triggerFilters: {
                deviceId: device._id,
            },
            actionDefinition: buildActionDefinition(device),
            conditionDefinition: buildConditionDefinition(),
            state: EventState.Active,
            metadata: null,
        });

        triggerWatch(device);

        return device;
    };

    const update: ZigbeeDeviceManager['update'] = async (existingDevice, zigbeeDevice) => {
        const newDevice = buildToUpdate(existingDevice, zigbeeDevice);

        if (existingDevice.state === DeviceState.Inactive) {
            newDevice.state = buildDeviceState(zigbeeDevice);
            newDevice.deactivatedBy = null;
        }

        const device = await devicesService.update(existingDevice, newDevice);

        triggerWatch(device);

        return device;
    };

    const findAll: ZigbeeDeviceManager['findAll'] = async () => {
        return devicesService.search({
            where: {
                protocol: DeviceProtocol.Zigbee,
            },
        });
    };

    const triggerWatch = (device: Device) => {
        setImmediate(() => {
            watchCallbacks.forEach((cb) => cb(device));
        });
    };

    const watch: ZigbeeDeviceManager['watch'] = (cb) => {
        watchCallbacks.add(cb);
    };

    const buildFeatures = (zigbeeDevice: ZigbeeDevice, device?: Device): DeviceDto['features'] => {
        const features: DeviceDto['features'] = {};

        if (zigbeeDevice.type === ZigbeeDeviceType.Coordinator || zigbeeDevice.type === ZigbeeDeviceType.Unknown) {
            return features;
        }

        const findUnit = (unit?: string): DeviceFeatureUnit | null => {
            if (!unit) {
                return null;
            }

            if (isDeviceFeatureUnit(unit)) {
                return unit;
            }

            logger.error({
                msg: `Unsupported unit '${unit}', setting null`,
                zigbeeDevice,
            });

            return null;
        };

        const findType = (type: string): DeviceFeatureType => {
            const typeUpper = type.toUpperCase(); // enums are UPPERCASE

            if (isDeviceFeatureType(typeUpper)) {
                return typeUpper;
            }

            logger.error({
                msg: `Unsupported type '${type}', setting ${DeviceFeatureType.Text}`,
                zigbeeDevice,
            });

            return DeviceFeatureType.Text;
        };

        const createFeature = ({
            type,
            property,
            description,
            unit,
            valueMax,
            valueMin,
            valueOff,
            valueOn,
            valueStep,
            valueToggle,
            values,
        }: ZigbeeDeviceFeature) => {
            // special 'type'
            if (!property) {
                return;
            }

            const existingFeature = get(device?.features, property);

            // user can update it themselves, don't overwrite it
            const featureDescription = existingFeature ? existingFeature.description : description;

            const genericFeature = {
                unit: unit ? findUnit(unit) : null,
                description: featureDescription || '',
            };

            const featureType = findType(type);

            switch (featureType) {
                case DeviceFeatureType.Text:
                    {
                        set(features, property, {
                            type: featureType,
                            ...genericFeature,
                        });
                    }
                    break;
                case DeviceFeatureType.Numeric:
                    {
                        set(features, property, {
                            type: featureType,
                            valueMax,
                            valueMin,
                            valueStep,
                            ...genericFeature,
                        });
                    }
                    break;
                case DeviceFeatureType.Binary:
                    {
                        set(features, property, {
                            type: featureType,
                            valueOff,
                            valueOn,
                            valueToggle,
                            ...genericFeature,
                        });
                    }
                    break;
                case DeviceFeatureType.Enum:
                    {
                        set(features, property, {
                            type: featureType,
                            values,
                            ...genericFeature,
                        });
                    }
                    break;
            }
        };

        zigbeeDevice.definition.exposes.map(({ features, ...feature }) => {
            createFeature(feature);

            features?.forEach(createFeature);
        });

        return features;
    };

    const buildToCreate = (zigbeeDevice: ZigbeeDevice): DeviceDto => {
        if (zigbeeDevice.type === ZigbeeDeviceType.Coordinator) {
            const bridgeInfo = getZigbeeInfo();

            return {
                type: DeviceType.Coordinator,
                displayName: zigbeeDevice.friendlyName,
                description: 'Coordinator',
                ieeeAddress: zigbeeDevice.ieeeAddress,
                state: DeviceState.Active,
                protocol: DeviceProtocol.Zigbee,
                model: bridgeInfo?.coordinator.type || 'Unknown',
                vendor: 'Unknown',
                manufacturer: 'Unknown',
                powerSource: DevicePowerSource.Dc,
                features: buildFeatures(zigbeeDevice),
                featureState: {},
            };
        } else if (zigbeeDevice.type === ZigbeeDeviceType.Unknown) {
            return {
                type: buildDeviceType(zigbeeDevice.type),
                displayName: zigbeeDevice.friendlyName,
                description: 'Unknown device',
                ieeeAddress: zigbeeDevice.ieeeAddress,
                state: buildDeviceState(zigbeeDevice),
                protocol: DeviceProtocol.Zigbee,
                model: 'Unknown',
                vendor: 'Unknown',
                manufacturer: 'Unknown',
                powerSource: DevicePowerSource.Unknown,
                features: buildFeatures(zigbeeDevice),
                featureState: {},
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
                features: buildFeatures(zigbeeDevice),
                featureState: {},
            };
        }
    };

    const buildToUpdate = (device: Device, zigbeeDevice: ZigbeeDevice): Partial<DeviceDto> => {
        if (zigbeeDevice.type === ZigbeeDeviceType.Coordinator) {
            const bridgeInfo = getZigbeeInfo();

            return {
                model: bridgeInfo?.coordinator.type || 'Unknown',
                state: buildDeviceState(zigbeeDevice),
            };
        } else if (zigbeeDevice.type === ZigbeeDeviceType.Unknown) {
            return {
                type: buildDeviceType(zigbeeDevice.type),
                state: buildDeviceState(zigbeeDevice),
            };
        } else {
            // update the description only once
            const description =
                device.type === DeviceType.Unknown ? zigbeeDevice.definition.description : device.description;

            return {
                type: buildDeviceType(zigbeeDevice.type),
                model: zigbeeDevice.definition.model,
                vendor: zigbeeDevice.definition.vendor,
                manufacturer: zigbeeDevice.manufacturer,
                powerSource: buildDevicePowerSource(zigbeeDevice.powerSource),
                state: buildDeviceState(zigbeeDevice),
                description,
                features: buildFeatures(zigbeeDevice, device),
            };
        }
    };

    const deactivate: ZigbeeDeviceManager['deactivate'] = async (device) => {
        const updatedDevice = await devicesService.update(device, {
            state: DeviceState.Inactive,
            deactivatedBy: {
                type: DeviceDeactivatedByType.Bridge,
                name: 'Zigbee',
            },
        });

        triggerWatch(updatedDevice);

        return updatedDevice;
    };

    return {
        create,
        update,
        findAll,
        watch,
        deactivate,
    };
};
