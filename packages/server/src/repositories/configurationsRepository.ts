import { timescaleDataSource } from '../dataSources/timescaleDataSource';
import { Configuration } from '../entities/configurationEntity';

export const createConfigurationsRepository = () => {
    return timescaleDataSource.getRepository(Configuration);
};
