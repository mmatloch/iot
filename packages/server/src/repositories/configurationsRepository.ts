import { timescaleDataSource } from '../dataSources/timescaleDataSource';
import { Configuration } from '../entities/configurationEntity';
import { getRepositoryExtension } from './repositoryExtension';

export const createConfigurationsRepository = () => {
    return timescaleDataSource.getRepository(Configuration).extend(getRepositoryExtension<Configuration>());
};
