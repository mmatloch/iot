import type { EventInstance, EventInstanceDto } from '../entities/eventInstanceEntity';
import { createEventInstancesRepository } from '../repositories/eventInstancesRepository';
import type { GenericService } from './genericService';

export interface EventInstancesService
    extends Pick<
        GenericService<EventInstance, EventInstanceDto>,
        'create' | 'search' | 'searchAndCount' | 'findByIdOrFail'
    > {}

export const createEventInstancesService = (): EventInstancesService => {
    const repository = createEventInstancesRepository();

    const create: EventInstancesService['create'] = (dto) => {
        const eventInstance = repository.create(dto);

        return repository.saveAndFind(eventInstance);
    };

    const findByIdOrFail: EventInstancesService['findByIdOrFail'] = (_id) => {
        return repository.findOneOrFail({
            where: { _id },
        });
    };

    const search: EventInstancesService['search'] = (query) => {
        return repository.find(query);
    };

    const searchAndCount: EventInstancesService['searchAndCount'] = (query) => {
        return repository.findAndCount(query);
    };

    return {
        create,
        findByIdOrFail,
        search,
        searchAndCount,
    };
};
