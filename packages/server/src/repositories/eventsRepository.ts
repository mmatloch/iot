import { timescaleDataSource } from '../dataSources/timescaleDataSource';
import { Event } from '../entities/eventEntity';

export const createEventsRepository = () => {
    return timescaleDataSource.getRepository(Event);
};
