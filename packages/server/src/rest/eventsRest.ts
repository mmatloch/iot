import { ApplicationPlugin } from '@common/application';
import { Type } from '@sinclair/typebox';
import { StatusCodes } from 'http-status-codes';
import { TypeORMError } from 'typeorm';

import { createAccessControl } from '../accessControl';
import { createSearchResponseSchema } from '../apis/searchApi';
import { EventTriggerType, eventDtoSchema, eventSchema } from '../entities/eventEntity';
import { eventInstanceSchema } from '../entities/eventInstance';
import { UserRole } from '../entities/userEntity';
import { createEventRunner } from '../events/eventRunner';
import errorHandlerPlugin from '../plugins/errorHandlerPlugin';
import { createEventInstancesService } from '../services/eventInstancesService';
import { createEventsService } from '../services/eventsService';

const createEventSchema = {
    body: eventDtoSchema,
    response: {
        [StatusCodes.OK]: eventSchema,
    },
};

const triggerEventSchema = {
    body: Type.Object(
        {
            filters: Type.Object({
                triggerType: Type.Enum(EventTriggerType),
                triggerFilters: Type.Record(Type.String(), Type.Unknown()),
            }),
            context: Type.Record(Type.String(), Type.Unknown()),
        },
        {
            additionalProperties: false,
        },
    ),
};

const searchEventInstancesSchema = {
    params: Type.Object({
        id: Type.Integer(),
    }),
    response: {
        [StatusCodes.OK]: createSearchResponseSchema(eventInstanceSchema),
    },
};

export const createEventsRest: ApplicationPlugin = async (app) => {
    app.register(errorHandlerPlugin, { entityName: 'Event' });

    app.withTypeProvider().post('/events', { schema: createEventSchema }, async (request, reply) => {
        const accessControl = createAccessControl(request.user);
        accessControl.authorize({
            role: UserRole.Admin,
        });

        const service = createEventsService();
        const event = await service.create(request.body);

        return reply.status(StatusCodes.CREATED).send(event);
    });

    app.withTypeProvider().post('/events/trigger', { schema: triggerEventSchema }, async (request, reply) => {
        const accessControl = createAccessControl(request.user);
        accessControl.authorize({
            role: UserRole.Admin,
        });

        const eventsService = createEventsService();
        const eventInstancesService = createEventInstancesService();

        const eventRunner = createEventRunner(eventsService, eventInstancesService);

        const result = await eventRunner.trigger(request.body);

        return reply.status(StatusCodes.OK).send(result);
    });

    app.withTypeProvider().get(
        '/events/:id/instances',
        { schema: searchEventInstancesSchema },
        async (request, reply) => {
            const accessControl = createAccessControl(request.user);
            accessControl.authorize({
                role: UserRole.Admin,
            });

            const service = createEventInstancesService();
            const searchResult = await service.search({ eventId: request.params.id });

            return reply.status(StatusCodes.OK).send(searchResult);
        },
    );
};
