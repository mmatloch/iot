import { SearchResponse, createSearchResponse } from '../apis/searchApi';
import { EventInstance, EventInstanceDto } from '../entities/eventInstanceEntity';
import { createEventInstancesRepository } from '../repositories/eventInstancesRepository';
import { GenericService } from './genericService';

export interface EventInstancesService
    extends Pick<GenericService<EventInstance, EventInstanceDto>, 'create' | 'search'> {}

export const createEventInstancesService = (): EventInstancesService => {
    const repository = createEventInstancesRepository();

    const create = async (dto: EventInstanceDto): Promise<EventInstance> => {
        const eventInstance = repository.create(dto);

        return repository.save(eventInstance);
    };

    const search = async (query: Partial<EventInstanceDto>): Promise<SearchResponse<EventInstance>> => {
        const [hits, totalHits] = await repository.findAndCountBy(query);

        return createSearchResponse({
            links: {},
            hits,
            meta: {
                totalHits,
            },
        });
    };

    return {
        create,
        search,
    };
};
