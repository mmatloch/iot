import { timescaleDataSource } from '../dataSources/timescaleDataSource';
import { EventSchedulerTask } from '../entities/eventSchedulerTaskEntity';
import { getRepositoryExtension } from './repositoryExtension';

export const createEventSchedulerTasksRepository = () => {
    return timescaleDataSource.getRepository(EventSchedulerTask).extend(getRepositoryExtension<EventSchedulerTask>());
};
