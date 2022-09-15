import { ApplicationPlugin } from '@common/application';
import { Type } from '@sinclair/typebox';
import { StatusCodes } from 'http-status-codes';
import { Equal } from 'typeorm';

import { createAccessControl } from '../accessControl';
import {
    RestSearchOptions,
    SortValue,
    createOffsetPaginationStrategy,
    createRestSearch,
    createSearchResponseSchema,
    searchQuerySchema,
} from '../apis/searchApi';
import { Event, EventDto, eventDtoSchema, eventSchema, eventUpdateSchema } from '../entities/eventEntity';
import { EventInstance, eventInstanceSchema } from '../entities/eventInstanceEntity';
import { UserRole } from '../entities/userEntity';
import { Errors } from '../errors';
import { EventActionOnInactive, EventTriggerType } from '../events/eventDefinitions';
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
    querystring: searchQuerySchema,
    response: {
        [StatusCodes.OK]: createSearchResponseSchema(eventSchema),
    },
};

const searchOptions: RestSearchOptions<Event> = {
    size: {
        default: 10,
    },
    sort: {
        allowedFields: ['_createdAt', '_updatedAt'],
        default: {
            _updatedAt: SortValue.Desc,
        },
    },
    filters: {
        allowedFields: ['displayName', 'state', 'triggerFilters', 'triggerType'],
    },
    pagination: {
        defaultStrategy: createOffsetPaginationStrategy(),
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
            options: Type.Optional(
                Type.Object({
                    onInactive: Type.Optional(Type.Enum(EventActionOnInactive)),
                }),
            ),
        },
        {
            additionalProperties: false,
        },
    ),
};

const searchEventInstancesSchema = {
    querystring: searchQuerySchema,
    response: {
        [StatusCodes.OK]: createSearchResponseSchema(eventInstanceSchema),
    },
};

const eventInstanceSearchOptions: RestSearchOptions<EventInstance> = {
    size: {
        default: 10,
    },
    sort: {
        allowedFields: ['_createdAt', '_updatedAt'],
        default: {
            _updatedAt: SortValue.Desc,
        },
    },
    filters: {
        allowedFields: ['eventId', 'eventRunId', 'state'],
    },
    pagination: {
        defaultStrategy: createOffsetPaginationStrategy(),
    },
};

const userEventUpdatableFields = [
    'displayName',
    'triggerType',
    'triggerFilters',
    'conditionDefinition',
    'actionDefinition',
    'metadata',
    'state',
];

const systemEventUpdatableFields = ['displayName'];

const checkUpdatableFields = (event: Partial<EventDto>, updatableFields: string[]) => {
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
        const accessControl = createAccessControl();
        accessControl.authorize({
            role: UserRole.Admin,
        });

        const service = createEventsService();
        const event = await service.create(request.body);

        return reply.status(StatusCodes.CREATED).send(event);
    });

    app.withTypeProvider().get('/events', { schema: searchEventsSchema }, async (request, reply) => {
        const accessControl = createAccessControl();
        accessControl.authorize();

        const searchResponse = await createRestSearch(createEventsService()).query(request.query, searchOptions);

        console.log(searchResponse._hits[0]);
        return reply.status(StatusCodes.OK).send(searchResponse);
    });

    app.withTypeProvider().get('/events/:id', { schema: getEventSchema }, async (request, reply) => {
        const accessControl = createAccessControl();
        accessControl.authorize();

        const service = createEventsService();
        const event = await service.findByIdOrFail(request.params.id);

        return reply.status(StatusCodes.OK).send(event);
    });

    app.withTypeProvider().patch('/events/:id', { schema: updateEventSchema }, async (request, reply) => {
        const accessControl = createAccessControl();
        accessControl.authorize({
            role: UserRole.Admin,
        });

        const service = createEventsService();
        const event = await service.findByIdOrFail(request.params.id);

        const isSystemCreated = event._createdBy === null;

        checkUpdatableFields(request.body, isSystemCreated ? systemEventUpdatableFields : userEventUpdatableFields);

        const updatedEvent = await service.update(event, request.body);

        return reply.status(StatusCodes.OK).send(updatedEvent);
    });

    app.withTypeProvider().post('/events/trigger', { schema: triggerEventSchema }, async (request, reply) => {
        const accessControl = createAccessControl();
        accessControl.authorize();

        if (request.body.filters.triggerType !== EventTriggerType.Api && !accessControl.hasRole(UserRole.Admin)) {
            throw Errors.forbidden();
        }

        const eventsService = createEventsService();

        const events = await eventsService.search({
            where: {
                triggerType: request.body.filters.triggerType,
                triggerFilters: Equal(request.body.filters.triggerFilters),
            },
        });

        const result = await Promise.all(
            events.map((event) => eventTriggerInNewContext(event, request.body.context, request.body.options)),
        );

        return reply.status(StatusCodes.CREATED).send(result);
    });

    app.withTypeProvider().get('/events/instances', { schema: searchEventInstancesSchema }, async (request, reply) => {
        const accessControl = createAccessControl();
        accessControl.authorize({
            role: UserRole.Admin,
        });

        const searchResponse = await createRestSearch(createEventInstancesService()).query(
            request.query,
            eventInstanceSearchOptions,
        );

        return reply.status(StatusCodes.OK).send(searchResponse);
    });
};
