import { SearchResponse, createSearchResponse } from '../apis/searchApi';
import { Event, EventDto } from '../entities/eventEntity';
import { createEventsRepository } from '../repositories/eventsRepository';
import { GenericService } from './genericService';

export interface EventsService extends GenericService<Event, EventDto> {}

export const createEventsService = (): EventsService => {
    const repository = createEventsRepository();

    const create = async (dto: EventDto): Promise<Event> => {
        const event = repository.create(dto);

        return repository.save(event);
    };

    const findByIdOrFail = async (_id: number): Promise<Event> => {
        return repository.findOneByOrFail({ _id });
    };

    const update = async (event: Event, updatedEvent: Partial<EventDto>): Promise<Event> => {
        return repository.save(repository.merge(event, updatedEvent));
    };

    const search = async (query: Partial<EventDto>): Promise<SearchResponse<Event>> => {
        const [hits, totalHits] = await repository.findAndCountBy(query);

        return createSearchResponse({
            links: {},
            meta: {
                totalHits,
            },
            hits,
        });
    };

    return {
        create,
        update,
        findByIdOrFail,
        search,
    };
};
