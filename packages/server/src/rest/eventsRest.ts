import { ApplicationPlugin } from '@common/application';
import { Type } from '@sinclair/typebox';
import { StatusCodes } from 'http-status-codes';

import { createAccessControl } from '../accessControl';
import { createSearchResponseSchema } from '../apis/searchApi';
import { EventDto, eventDtoSchema, eventSchema } from '../entities/eventEntity';
import { UserRole } from '../entities/userEntity';
import { Errors } from '../errors';
import errorHandlerPlugin from '../plugins/errorHandlerPlugin';
import { createEventsService } from '../services/eventsService';

const createEventSchema = {
    body: eventDtoSchema,
    response: {
        [StatusCodes.OK]: eventSchema,
    },
};

const getEventSchema = {
    params: Type.Object({
        id: Type.Integer(),
    }),
    response: {
        [StatusCodes.OK]: eventSchema,
    },
};

const partialEventDtoSchema = Type.Partial(eventDtoSchema);

const searchEventsSchema = {
    querystring: partialEventDtoSchema,
    response: {
        [StatusCodes.OK]: createSearchResponseSchema(eventSchema),
    },
};

const updateEventSchema = {
    params: Type.Object({
        id: Type.Integer(),
    }),
    body: partialEventDtoSchema,
    response: {
        [StatusCodes.OK]: eventSchema,
    },
};

const updatableFields = ['displayName', 'triggerType', 'triggerFilters', 'conditionDefinition', 'actionDefinition'];

const checkUpdatableFields = (event: Partial<EventDto>) => {
    Object.keys(event).forEach((key) => {
        if (!updatableFields.includes(key)) {
            throw Errors.noPermissionToUpdateField({
                detail: key,
            });
        }
    });
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

    app.withTypeProvider().get('/events', { schema: searchEventsSchema }, async (request, reply) => {
        const accessControl = createAccessControl(request.user);
        accessControl.authorize();

        const service = createEventsService();
        const searchResponse = await service.search(request.query);

        return reply.status(StatusCodes.OK).send(searchResponse);
    });

    app.withTypeProvider().get('/events/:id', { schema: getEventSchema }, async (request, reply) => {
        const accessControl = createAccessControl(request.user);
        accessControl.authorize();

        const service = createEventsService();
        const event = await service.findByIdOrFail(request.params.id);

        return reply.status(StatusCodes.OK).send(event);
    });

    app.withTypeProvider().patch('/events/:id', { schema: updateEventSchema }, async (request, reply) => {
        const accessControl = createAccessControl(request.user);
        accessControl.authorize({
            role: UserRole.Admin,
        });

        const service = createEventsService();
        const event = await service.findByIdOrFail(request.params.id);

        checkUpdatableFields(request.body);

        const updatedEvent = await service.update(event, request.body);

        return reply.status(StatusCodes.OK).send(updatedEvent);
    });
};
