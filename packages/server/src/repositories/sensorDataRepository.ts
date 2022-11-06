import { timescaleDataSource } from '../dataSources/timescaleDataSource';
import { SensorData } from '../entities/sensorDataEntity';
import { getRepositoryExtension } from './repositoryExtension';

export const createSensorDataRepository = () => {
    return timescaleDataSource.getRepository(SensorData).extend(
        getRepositoryExtension<SensorData>({
            loadRelations: false,
        }),
    );
};
