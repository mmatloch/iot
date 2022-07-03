import { Event, EventDto } from '../entities/eventEntity';
import { createEventsRepository } from '../repositories/eventsRepository';

export const createEventsService = () => {
    const repository = createEventsRepository();

    const create = async (dto: EventDto): Promise<Event> => {
        const event = repository.create(dto);

        return repository.save(event);
    };

    return {
        create,
    };
};
