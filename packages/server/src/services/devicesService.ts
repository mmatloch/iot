import { SearchResponse, createSearchResponse } from '../apis/searchApi';
import { Device, DeviceDto } from '../entities/deviceEntity';
import { createDevicesRepository } from '../repositories/devicesRepository';
import { GenericService } from './genericService';

export interface DevicesService extends GenericService<Device, DeviceDto> {}

export const createDevicesService = (): DevicesService => {
    const repository = createDevicesRepository();

    const create = async (dto: DeviceDto): Promise<Device> => {
        const device = repository.create(dto);

        return repository.save(device);
    };

    const search = async (query: Partial<Device>): Promise<SearchResponse<Device>> => {
        const [devices, totalHits] = await repository.findAndCountBy(query);

        return createSearchResponse({
            links: {},
            meta: {
                totalHits,
            },
            hits: devices,
        });
    };

    const findByIdOrFail = async (_id: number): Promise<Device> => {
        return repository.findOneByOrFail({
            _id,
        });
    };

    const update = (device: Device, updatedDevice: Partial<Device>) => {
        return repository.save(repository.merge(device, updatedDevice));
    };

    return {
        create,
        search,
        findByIdOrFail,
        update,
    };
};
