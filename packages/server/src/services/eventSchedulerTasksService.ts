import _ from 'lodash';
import type { RemoveOptions } from 'typeorm';

import type { Event } from '../entities/eventEntity';
import type { EventSchedulerTask, EventSchedulerTaskDto } from '../entities/eventSchedulerTaskEntity';
import { createEventSchedulerTasksRepository } from '../repositories/eventSchedulerTasksRepository';
import type { GenericService } from './genericService';

export interface EventSchedulerTasksService extends GenericService<EventSchedulerTask, EventSchedulerTaskDto> {
    removeByEvent: (event: Event, opts?: RemoveOptions) => Promise<EventSchedulerTask[]>;
    remove: (task: EventSchedulerTask) => Promise<EventSchedulerTask>;
}

export const createEventSchedulerTasksService = (): EventSchedulerTasksService => {
    const repository = createEventSchedulerTasksRepository();

    const create: EventSchedulerTasksService['create'] = async (dto) => {
        const schedulerTask = repository.create(dto);

        return repository.saveAndFind(schedulerTask);
    };

    const search: EventSchedulerTasksService['search'] = (query) => {
        return repository.find(query);
    };

    const searchAndCount: EventSchedulerTasksService['searchAndCount'] = (query) => {
        return repository.findAndCount(query);
    };

    const findByIdOrFail: EventSchedulerTasksService['findByIdOrFail'] = (_id) => {
        return repository.findOneOrFail({
            where: { _id },
            relations: {
                _createdByUser: true,
                _updatedByUser: true,
            },
        });
    };

    const update: EventSchedulerTasksService['update'] = async (schedulerTask, updatedSchedulerTask) => {
        const newSchedulerTask = repository.merge(repository.create(schedulerTask), updatedSchedulerTask);

        if (_.isEqual(schedulerTask, newSchedulerTask)) {
            return schedulerTask;
        }

        return repository.saveAndFind(newSchedulerTask);
    };

    const remove: EventSchedulerTasksService['remove'] = (schedulerTask) => {
        return repository.remove(schedulerTask);
    };

    const removeByEvent: EventSchedulerTasksService['removeByEvent'] = async (event, opts) => {
        const schedulerTasks = await search({
            where: {
                eventId: event._id,
            },
        });

        return repository.remove(schedulerTasks, opts);
    };

    return {
        create,
        search,
        searchAndCount,
        findByIdOrFail,
        update,
        remove,
        removeByEvent,
    };
};
