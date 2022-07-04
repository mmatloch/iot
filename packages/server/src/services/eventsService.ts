import { transformError } from '@common/application/src/errorTransformer';

import { SearchResponse, createSearchResponse } from '../apis/searchApi';
import { Event, EventDto } from '../entities/eventEntity';
import { createEventsRepository } from '../repositories/eventsRepository';
import { GenericService } from './genericService';

export interface EventsService extends Pick<GenericService<Event, EventDto>, 'create' | 'search'> {}

export const createEventsService = (): EventsService => {
    const repository = createEventsRepository();

    const create = async (dto: EventDto): Promise<Event> => {
        const event = repository.create(dto);

        return repository.save(event);
    };

    const search = async (query: Partial<Event>): Promise<SearchResponse<Event>> => {
        const [users, totalHits] = await repository.findAndCountBy(query);

        return createSearchResponse({
            links: {},
            meta: {
                totalHits,
            },
            hits: users,
        });
    };

    return {
        create,
        search,
    };
};
