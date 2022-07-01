import { timescaleDataSource } from '../dataSources/timescaleDataSource';
import { Device } from '../entities/deviceEntity';

export const createDevicesRepository = () => {
    return timescaleDataSource.getRepository(Device);
};
