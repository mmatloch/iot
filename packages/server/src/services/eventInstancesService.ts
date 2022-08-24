import { EventInstance, EventInstanceDto } from '../entities/eventInstanceEntity';
import { createEventInstancesRepository } from '../repositories/eventInstancesRepository';
import { GenericService } from './genericService';

export interface EventInstancesService
    extends Pick<GenericService<EventInstance, EventInstanceDto>, 'create' | 'search' | 'searchAndCount'> {}

export const createEventInstancesService = (): EventInstancesService => {
    const repository = createEventInstancesRepository();

    const create: EventInstancesService['create'] = (dto) => {
        const eventInstance = repository.create(dto);

        return repository.save(eventInstance);
    };

    const search: EventInstancesService['search'] = (query) => {
        return repository.find(query);
    };

    const searchAndCount: EventInstancesService['searchAndCount'] = (query) => {
        return repository.findAndCount(query);
    };

    return {
        create,
        search,
        searchAndCount,
    };
};
