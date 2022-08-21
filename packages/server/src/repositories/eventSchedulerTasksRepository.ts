import { timescaleDataSource } from '../dataSources/timescaleDataSource';
import { EventSchedulerTask } from '../entities/eventSchedulerTaskEntity';

export const createEventSchedulerTasksRepository = () => {
    return timescaleDataSource.getRepository(EventSchedulerTask);
};
