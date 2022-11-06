import { ApplicationPlugin } from '@common/application';
import { StatusCodes } from 'http-status-codes';

import { createAccessControl } from '../accessControl';
import {
    RestSearchOptions,
    SortValue,
    createOffsetPaginationStrategy,
    createRestSearch,
    createSearchResponseSchema,
    searchQuerySchema,
} from '../apis/searchApi';
import { EventSchedulerTask, eventSchedulerTaskSchema } from '../entities/eventSchedulerTaskEntity';
import errorHandlerPlugin from '../plugins/errorHandlerPlugin';
import { createEventSchedulerTasksService } from '../services/eventSchedulerTasksService';

const searchEventSchedulerTasksSchema = {
    querystring: searchQuerySchema,
    response: {
        [StatusCodes.OK]: createSearchResponseSchema(eventSchedulerTaskSchema),
    },
};

const searchOptions: RestSearchOptions<EventSchedulerTask> = {
    size: {
        default: 10,
    },
    sort: {
        allowedFields: ['_createdAt', '_updatedAt', 'nextRunAt'],
        default: {
            _updatedAt: SortValue.Desc,
        },
    },
    filters: {
        allowedFields: ['eventId', 'nextRunAt', 'state'],
    },
    pagination: {
        defaultStrategy: createOffsetPaginationStrategy(),
    },
    relations: {
        allowedFields: ['_createdByUser', '_updatedByUser'],
    },
};

export const createEventSchedulerTasksRest: ApplicationPlugin = async (app) => {
    app.register(errorHandlerPlugin, { entityName: 'EventSchedulerTask' });

    app.withTypeProvider().get(
        '/events/scheduler/tasks',
        { schema: searchEventSchedulerTasksSchema },
        async (request, reply) => {
            const accessControl = createAccessControl();
            accessControl.authorize();

            const searchResponse = await createRestSearch(createEventSchedulerTasksService()).query(
                request.query,
                searchOptions,
            );

            return reply.status(StatusCodes.OK).send(searchResponse);
        },
    );
};
