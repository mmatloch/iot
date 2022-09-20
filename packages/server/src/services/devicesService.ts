import _ from 'lodash';

import { Device, DeviceDto } from '../entities/deviceEntity';
import { createDevicesRepository } from '../repositories/devicesRepository';
import { GenericService } from './genericService';

export interface DevicesService extends GenericService<Device, DeviceDto> {}

export const createDevicesService = (): DevicesService => {
    const repository = createDevicesRepository();

    const create: DevicesService['create'] = async (dto) => {
        const device = repository.create(dto);

        return repository.save(device);
    };

    const search: DevicesService['search'] = (query) => {
        return repository.find(query);
    };

    const searchAndCount: DevicesService['searchAndCount'] = (query) => {
        return repository.findAndCount(query);
    };

    const findByIdOrFail: DevicesService['findByIdOrFail'] = async (_id) => {
        return repository.findOneOrFail({
            where: { _id },
            relations: {
                _createdByUser: true,
                _updatedByUser: true,
            },
        });
    };

    const update: DevicesService['update'] = (device, updatedDevice) => {
        const deviceClone = repository.create(device);
        return repository.save(repository.merge(deviceClone, updatedDevice));
    };

    return {
        create,
        search,
        searchAndCount,
        findByIdOrFail,
        update,
    };
};
