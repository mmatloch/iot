import _ from 'lodash';
import { RemoveOptions } from 'typeorm';

import { Event } from '../entities/eventEntity';
import { EventSchedulerTask, EventSchedulerTaskDto } from '../entities/eventSchedulerTaskEntity';
import { createEventSchedulerTasksRepository } from '../repositories/eventSchedulerTasksRepository';
import { GenericService } from './genericService';

export interface EventSchedulerTasksService extends GenericService<EventSchedulerTask, EventSchedulerTaskDto> {
    removeByEvent: (event: Event, opts?: RemoveOptions) => Promise<EventSchedulerTask[]>;
    remove: (task: EventSchedulerTask) => Promise<EventSchedulerTask>;
}

export const createEventSchedulerTasksService = (): EventSchedulerTasksService => {
    const repository = createEventSchedulerTasksRepository();

    const create: EventSchedulerTasksService['create'] = async (dto) => {
        const schedulerTask = repository.create(dto);

        return repository.save(schedulerTask);
    };

    const search: EventSchedulerTasksService['search'] = (query) => {
        return repository.find(query);
    };

    const searchAndCount: EventSchedulerTasksService['searchAndCount'] = (query) => {
        return repository.findAndCount(query);
    };

    const findByIdOrFail: EventSchedulerTasksService['findByIdOrFail'] = (_id) => {
        return repository.findOneByOrFail({ _id });
    };

    const update: EventSchedulerTasksService['update'] = (schedulerTask, updatedSchedulerTask) => {
        const schedulerTaskClone = repository.create(schedulerTask);
        return repository.save(repository.merge(schedulerTaskClone, updatedSchedulerTask));
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