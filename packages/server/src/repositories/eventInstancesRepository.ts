import { timescaleDataSource } from '../dataSources/timescaleDataSource';
import { EventInstance } from '../entities/eventInstanceEntity';

export const createEventInstancesRepository = () => {
    return timescaleDataSource.getRepository(EventInstance);
};
