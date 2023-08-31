import { createDevicesService } from '../../services/devicesService';

export const createDevicesSdk = () => {
    const devicesService = createDevicesService();

    const findByIdOrFail = (id: number) => {
        return devicesService.findByIdOrFail(id);
    };

    return {
        findByIdOrFail,
    };
};
