import _ from 'lodash';
import { In } from 'typeorm';

import { DeviceData, DeviceDeactivatedByType, DeviceState } from '../definitions/deviceDefinitions';
import { getDeviceFeatureState } from '../devices/deviceFeatures';
import type { Device, DeviceDto } from '../entities/deviceEntity';
import { Errors } from '../errors';
import { getLogger } from '../logger';
import { createDevicesRepository } from '../repositories/devicesRepository';
import type { GenericService } from './genericService';
import { createUsersService } from './usersService';

const logger = getLogger();

export interface DevicesService extends GenericService<Device, DeviceDto> {
    assertStateUpdate: (device: Device, newState: DeviceState) => void;
    updateFeatures: (device: Device, data: DeviceData) => Promise<Device>;
}

export const createDevicesService = (): DevicesService => {
    const repository = createDevicesRepository();

    const create: DevicesService['create'] = async (dto) => {
        const device = repository.create(dto);

        return repository.saveAndFind(device);
    };

    const enrichDevices = async (devices: Device[]) => {
        const userIds = devices.reduce((acc, device) => {
            if (device.deactivatedBy?.type === DeviceDeactivatedByType.User) {
                acc.push(device.deactivatedBy.userId);
            }

            return acc;
        }, [] as number[]);

        const users = await createUsersService().search({
            where: {
                _id: In(userIds),
            },
        });

        devices.forEach((device) => {
            if (device.deactivatedBy?.type === DeviceDeactivatedByType.User) {
                const deactivatedByUserId = device.deactivatedBy.userId;
                const user = users.find((user) => user._id === deactivatedByUserId);

                if (user) {
                    device.deactivatedBy._user = user;
                }
            }
        });
    };

    const search: DevicesService['search'] = async (query) => {
        const result = await repository.find(query);

        await enrichDevices(result);

        return result;
    };

    const searchAndCount: DevicesService['searchAndCount'] = async (query) => {
        const result = await repository.findAndCount(query);

        await enrichDevices(result[0]);

        return result;
    };

    const findByIdOrFail: DevicesService['findByIdOrFail'] = async (_id) => {
        const device = await repository.findOneOrFail({
            where: { _id },
            relations: {
                _createdByUser: true,
                _updatedByUser: true,
            },
        });

        await enrichDevices([device]);

        return device;
    };

    const update: DevicesService['update'] = async (device, updatedDevice) => {
        const newDevice = repository.merge(repository.create(device), updatedDevice);

        if (_.isEqual(device, newDevice)) {
            return device;
        }

        return repository.saveAndFind(newDevice);
    };

    const assertStateUpdate: DevicesService['assertStateUpdate'] = (device, newState) => {
        if (newState !== DeviceState.Active && newState !== DeviceState.Inactive) {
            throw Errors.cannotUpdateDeviceState({
                detail: `You can only update the state to '${DeviceState.Active}' or '${DeviceState.Inactive}'`,
            });
        }

        if (device.state !== DeviceState.Active && device.state !== DeviceState.Inactive) {
            throw Errors.cannotUpdateDeviceState({
                detail: `You can only update a device whose state is '${DeviceState.Active}' or '${DeviceState.Inactive}'`,
            });
        }

        if (device.deactivatedBy?.type === DeviceDeactivatedByType.Bridge) {
            throw Errors.cannotUpdateDeviceState({
                detail: `The device was deactivated by the bridge`,
            });
        }
    };

    const updateFeatures: DevicesService['updateFeatures'] = async (
        device: Device,
        deviceData: DeviceData,
    ): Promise<Device> => {
        const { newFeatureState, featureStateChanges } = getDeviceFeatureState(device, deviceData);

        if (featureStateChanges.length) {
            logger.debug({
                msg: `Updating the '${device.displayName}' device, ${featureStateChanges.length} feature changes`,
                device,
            });

            const service = createDevicesService();
            return service.update(device, {
                featureState: newFeatureState,
            });
        }

        logger.debug({
            msg: `No feature changes`,
            device,
        });

        return device;
    };

    return {
        create,
        search,
        searchAndCount,
        findByIdOrFail,
        update,
        assertStateUpdate,
        updateFeatures,
    };
};
