import { Device } from '../../entities/deviceEntity';
import { createDevicesService } from '../../services/devicesService';

export const createDevicesSdk = () => {
    const devicesService = createDevicesService();

    const createSensorData = async (id: number, sensorData: Device['sensorData']) => {
        const device = await devicesService.findByIdOrFail(id);

        await devicesService.update(device, {
            sensorData,
        });
    };

    return {
        createSensorData,
    };
};
