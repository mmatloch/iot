import { timescaleDataSource } from '../dataSources/timescaleDataSource';
import { EventInstance } from '../entities/eventInstance';

export const createEventInstancesRepository = () => {
    return timescaleDataSource.getRepository(EventInstance);
};
