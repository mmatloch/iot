import { SearchResponse, createSearchResponse } from '../apis/searchApi';
import { Device, DeviceDto } from '../entities/deviceEntity';
import { createDevicesRepository } from '../repositories/devicesRepository';

export const createDevicesService = () => {
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

    return {
        create,
        search,
    };
};
