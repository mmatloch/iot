import { createSearchResponse } from '../apis/searchApi';
import { EventInstance, EventInstanceDto, EventInstanceSearchQuery } from '../entities/eventInstanceEntity';
import { createEventInstancesRepository } from '../repositories/eventInstancesRepository';
import { GenericService } from './genericService';

export interface EventInstancesService
    extends Pick<GenericService<EventInstance, EventInstanceDto, EventInstanceSearchQuery>, 'create' | 'search'> {}

export const createEventInstancesService = (): EventInstancesService => {
    const repository = createEventInstancesRepository();

    const create: EventInstancesService['create'] = (dto) => {
        const eventInstance = repository.create(dto);

        return repository.save(eventInstance);
    };

    const search: EventInstancesService['search'] = async (query) => {
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
