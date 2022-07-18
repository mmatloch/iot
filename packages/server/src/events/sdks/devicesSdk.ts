import { GenericDataPublisher } from '../../bridges/generic/genericDataPublisher';
import { getZigbeeDataPublisher } from '../../bridges/zigbee/zigbeeDataPublisher';
import { Device, DeviceProtocol } from '../../entities/deviceEntity';
import { createDevicesService } from '../../services/devicesService';

const getDataPublisher = (device: Device): GenericDataPublisher => {
    switch (device.protocol) {
        case DeviceProtocol.Zigbee:
            return getZigbeeDataPublisher();

        default:
            throw new Error(`Missing data publisher for '${device.protocol}' protocol`);
    }
};

export const createDevicesSdk = () => {
    const devicesService = createDevicesService();

    const findByIdOrFail = (id: number) => {
        return devicesService.findByIdOrFail(id);
    };

    const createSensorData = async (device: Device, sensorData: Device['sensorData']) => {
        await devicesService.update(device, {
            sensorData,
        });
    };

    const publishData = async (device: Device, data: Record<string, unknown>) => {
        const dataPublisher = getDataPublisher(device);

        await dataPublisher.publish(device, data);
    };

    return {
        findByIdOrFail,
        createSensorData,
        publishData,
    };
};
