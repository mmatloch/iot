import { createEventsRepository } from '../repositories/eventsRepository';

export const createEventsService = () => {
    const repository = createEventsRepository();

    return {};
};
