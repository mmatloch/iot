import { timescaleDataSource } from '../dataSources/timescaleDataSource';
import { Widget } from '../entities/widgetEntity';
import { getRepositoryExtension } from './repositoryExtension';

export const createWidgetsRepository = () => {
    return timescaleDataSource.getRepository(Widget).extend(getRepositoryExtension<Widget>());
};
