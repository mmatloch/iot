import { timescaleDataSource } from '../dataSources/timescaleDataSource';
import { Event } from '../entities/eventEntity';
import { getRepositoryExtension } from './repositoryExtension';

export const createEventsRepository = () => {
    return timescaleDataSource.getRepository(Event).extend(getRepositoryExtension<Event>());
};
