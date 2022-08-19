import { ApplicationPlugin } from '@common/application';
import { Type } from '@sinclair/typebox';
import { StatusCodes } from 'http-status-codes';

import { createAccessControl } from '../accessControl';
import { createSearchResponseSchema } from '../apis/searchApi';
import {
    EventDto,
    eventDtoSchema,
    eventSchema,
    eventSearchQuerySchema,
    eventUpdateSchema,
} from '../entities/eventEntity';
import { eventInstanceSchema, eventInstanceSearchQuerySchema } from '../entities/eventInstanceEntity';
import { UserRole } from '../entities/userEntity';
import { Errors } from '../errors';
import { EventTriggerType } from '../events/eventDefinitions';
import { eventTriggerInNewContext } from '../events/eventTriggerInNewContext';
import errorHandlerPlugin from '../plugins/errorHandlerPlugin';
import { createEventInstancesService } from '../services/eventInstancesService';
import { createEventsService } from '../services/eventsService';

const createEventSchema = {
    body: eventDtoSchema,
    response: {
        [StatusCodes.CREATED]: eventSchema,
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

const searchEventsSchema = {
    querystring: eventSearchQuerySchema,
    response: {
        [StatusCodes.OK]: createSearchResponseSchema(eventSchema),
    },
};

const updateEventSchema = {
    params: Type.Object({
        id: Type.Integer(),
    }),
    body: eventUpdateSchema,
    response: {
        [StatusCodes.OK]: eventSchema,
    },
};

const triggerEventSchema = {
    body: Type.Object(
        {
            filters: Type.Object(
                {
                    triggerType: Type.Enum(EventTriggerType, { default: EventTriggerType.Api }),
                    triggerFilters: Type.Record(Type.String(), Type.Unknown()),
                },
                {
                    additionalProperties: false,
                },
            ),
            context: Type.Record(Type.String(), Type.Unknown()),
        },
        {
            additionalProperties: false,
        },
    ),
};

const searchEventInstancesSchema = {
    querystring: eventInstanceSearchQuerySchema,
    response: {
        [StatusCodes.OK]: createSearchResponseSchema(eventInstanceSchema),
    },
};

const updatableFields = [
    'displayName',
    'triggerType',
    'triggerFilters',
    'conditionDefinition',
    'actionDefinition',
    'metadata',
];

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

    app.withTypeProvider().post('/events/trigger', { schema: triggerEventSchema }, async (request, reply) => {
        const accessControl = createAccessControl(request.user);
        accessControl.authorize();

        if (request.body.filters.triggerType !== EventTriggerType.Api && !accessControl.hasRole(UserRole.Admin)) {
            throw Errors.forbidden();
        }

        const eventsService = createEventsService();

        const { _hits: events } = await eventsService.search({
            triggerType: request.body.filters.triggerType,
            triggerFilters: request.body.filters.triggerFilters,
        });

        const result = await Promise.all(events.map((event) => eventTriggerInNewContext(event, request.body.context)));

        return reply.status(StatusCodes.CREATED).send(result);
    });

    app.withTypeProvider().get('/events/instances', { schema: searchEventInstancesSchema }, async (request, reply) => {
        const accessControl = createAccessControl(request.user);
        accessControl.authorize({
            role: UserRole.Admin,
        });

        const service = createEventInstancesService();
        const searchResult = await service.search(request.query);

        return reply.status(StatusCodes.OK).send(searchResult);
    });
};
