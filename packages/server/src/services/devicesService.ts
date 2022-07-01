import { Device, DeviceDto } from '../entities/deviceEntity';
import { createDevicesRepository } from '../repositories/devicesRepository';

export const createDevicesService = () => {
    const repository = createDevicesRepository();

    const create = async (dto: DeviceDto): Promise<Device> => {
        const device = repository.create(dto);

        return repository.save(device);
    };

    return {
        create,
    };
};
