import { timescaleDataSource } from '../dataSources/timescaleDataSource';
import { EventInstance } from '../entities/eventInstanceEntity';
import { getRepositoryExtension } from './repositoryExtension';

export const createEventInstancesRepository = () => {
    return timescaleDataSource.getRepository(EventInstance).extend(
        getRepositoryExtension<EventInstance>({
            loadRelations: false,
        }),
    );
};
