import { timescaleDataSource } from '../dataSources/timescaleDataSource';
import { Dashboard } from '../entities/dashboardEntity';
import { getRepositoryExtension } from './repositoryExtension';

export const createDashboardsRepository = () => {
    return timescaleDataSource.getRepository(Dashboard).extend(getRepositoryExtension<Dashboard>());
};
