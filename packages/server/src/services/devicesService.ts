import _ from 'lodash';

import { createSearchResponse } from '../apis/searchApi';
import { Device, DeviceDto, DeviceSearchQuery } from '../entities/deviceEntity';
import { createDevicesRepository } from '../repositories/devicesRepository';
import { GenericService } from './genericService';

export interface DevicesService extends GenericService<Device, DeviceDto, DeviceSearchQuery> {}

export const createDevicesService = (): DevicesService => {
    const repository = createDevicesRepository();

    const create: DevicesService['create'] = async (dto) => {
        const device = repository.create(dto);

        return repository.save(device);
    };

    const search: DevicesService['search'] = async (query) => {
        const [devices, totalHits] = await repository.findAndCountBy(query);

        return createSearchResponse({
            links: {},
            meta: {
                totalHits,
            },
            hits: devices,
        });
    };

    const findByIdOrFail: DevicesService['findByIdOrFail'] = async (_id) => {
        return repository.findOneByOrFail({
            _id,
        });
    };

    const update: DevicesService['update'] = (device, updatedDevice) => {
        const deviceClone = repository.create(device);
        return repository.save(repository.merge(deviceClone, updatedDevice));
    };

    return {
        create,
        search,
        findByIdOrFail,
        update,
    };
};
