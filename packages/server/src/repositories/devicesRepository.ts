import { timescaleDataSource } from '../dataSources/timescaleDataSource';
import { Device } from '../entities/deviceEntity';
import { getRepositoryExtension } from './repositoryExtension';

export const createDevicesRepository = () => {
    return timescaleDataSource.getRepository(Device).extend(getRepositoryExtension<Device>());
};
