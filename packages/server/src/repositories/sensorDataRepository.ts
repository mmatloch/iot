import { timescaleDataSource } from '../dataSources/timescaleDataSource';
import { SensorData } from '../entities/sensorDataEntity';

export const createSensorDataRepository = () => {
    return timescaleDataSource.getRepository(SensorData);
};
