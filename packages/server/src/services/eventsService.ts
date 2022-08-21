import CronParser from 'cron-parser';

import { createSearchResponse } from '../apis/searchApi';
import { Event, EventDto, EventSearchQuery } from '../entities/eventEntity';
import { Errors } from '../errors';
import { EventMetadataTaskType, EventMetadataType, EventTriggerType } from '../events/eventDefinitions';
import { createEventsRepository } from '../repositories/eventsRepository';
import { GenericService } from './genericService';

export interface EventsService extends GenericService<Event, EventDto, EventSearchQuery> {}

export const createEventsService = (): EventsService => {
    const repository = createEventsRepository();

    const validateCronExpression = (cronExpression: string) => {
        try {
            CronParser.parseExpression(cronExpression);
        } catch (e) {
            throw Errors.invalidEventMetadata('Invalid cron expression', { cause: e });
        }
    };

    const validateMetadata = (event: Event) => {
        if (event.triggerType === EventTriggerType.Scheduler) {
            if (event.metadata?.type !== EventMetadataType.Scheduler) {
                throw Errors.invalidEventMetadata(
                    `Event with triggerType '${EventTriggerType.Scheduler}' requires metadata with type '${EventMetadataType.Scheduler}'`,
                );
            }

            const { taskType } = event.metadata;

            switch (taskType) {
                case EventMetadataTaskType.RelativeCron:
                    {
                        if (!event.metadata.runAfterEvent) {
                            throw Errors.invalidEventMetadata(
                                `An event with the task type '${taskType}' must have 'runAfterEvent' defined`,
                            );
                        }

                        if (!event.metadata.cronExpression) {
                            throw Errors.invalidEventMetadata(
                                `An event with the task type '${taskType}' must have 'cronExpression' defined`,
                            );
                        }

                        validateCronExpression(event.metadata.cronExpression);
                    }
                    break;

                case EventMetadataTaskType.StaticCron:
                    {
                        if (!event.metadata.cronExpression) {
                            throw Errors.invalidEventMetadata(
                                `An event with the task type '${taskType}' must have 'cronExpression' defined`,
                            );
                        }

                        validateCronExpression(event.metadata.cronExpression);
                    }
                    break;

                case EventMetadataTaskType.RelativeInterval:
                    {
                        if (!event.metadata.runAfterEvent) {
                            throw Errors.invalidEventMetadata(
                                `An event with the task type '${taskType}' must have 'runAfterEvent' defined`,
                            );
                        }

                        if (!event.metadata.interval) {
                            throw Errors.invalidEventMetadata(
                                `An event with the task type '${taskType}' must have 'interval' defined`,
                            );
                        }
                    }
                    break;

                case EventMetadataTaskType.StaticInterval:
                    {
                        if (!event.metadata.interval) {
                            throw Errors.invalidEventMetadata(
                                `An event with the task type '${taskType}' must have 'interval' defined`,
                            );
                        }
                    }
                    break;
            }
        }
    };

    const create: EventsService['create'] = (dto) => {
        const event = repository.create(dto);

        validateMetadata(event);

        return repository.save(event);
    };

    const findByIdOrFail: EventsService['findByIdOrFail'] = (_id) => {
        return repository.findOneByOrFail({ _id });
    };

    const update: EventsService['update'] = (event, updatedEvent) => {
        const newEvent = repository.merge(event, updatedEvent);

        validateMetadata(newEvent);

        return repository.save(newEvent);
    };

    const search: EventsService['search'] = async (query) => {
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
