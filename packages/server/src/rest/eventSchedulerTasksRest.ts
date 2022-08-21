import { ApplicationPlugin } from '@common/application';
import { StatusCodes } from 'http-status-codes';

import { createAccessControl } from '../accessControl';
import { createSearchResponseSchema } from '../apis/searchApi';
import { eventSchedulerTaskSchema, eventSchedulerTaskSearchQuerySchema } from '../entities/eventSchedulerTaskEntity';
import errorHandlerPlugin from '../plugins/errorHandlerPlugin';
import { createEventSchedulerTasksService } from '../services/eventSchedulerTasksService';

const searchEventSchedulerTasksSchema = {
    querystring: eventSchedulerTaskSearchQuerySchema,
    response: {
        [StatusCodes.OK]: createSearchResponseSchema(eventSchedulerTaskSchema),
    },
};

export const createEventSchedulerTasksRest: ApplicationPlugin = async (app) => {
    app.register(errorHandlerPlugin, { entityName: 'EventSchedulerTask' });

    app.withTypeProvider().get(
        '/events/scheduler/tasks',
        { schema: searchEventSchedulerTasksSchema },
        async (request, reply) => {
            const accessControl = createAccessControl(request.user);
            accessControl.authorize();

            const service = createEventSchedulerTasksService();
            const event = await service.search(request.query);

            return reply.status(StatusCodes.OK).send(event);
        },
    );
};
