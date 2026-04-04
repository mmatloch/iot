import type { ApplicationPlugin } from '@common/application';
import { Type } from '@sinclair/typebox';
import { StatusCodes } from 'http-status-codes';

import { createAccessControl } from '../accessControl';
import { buildQueryFromRaw } from '../apis/search/queryBuilder';
import { FilterOperator } from '../apis/search/searchDefinitions';
import type { BuildQueryFromRawOptions } from '../apis/search/queryBuilder';
import { SortValue, searchQuerySchema } from '../apis/searchApi';
import { EventInstance, eventInstanceSchema } from '../entities/eventInstanceEntity';
import errorHandlerPlugin from '../plugins/errorHandlerPlugin';
import { createEventInstancesService } from '../services/eventInstancesService';

const getEventInstanceSchema = {
    params: Type.Object({
        id: Type.Integer(),
    }),
    response: {
        [StatusCodes.OK]: eventInstanceSchema,
    },
};

const searchEventInstancesSchema = {
    querystring: Type.Object({
        ...searchQuerySchema.properties,
        cursor: Type.Optional(Type.String()),
    }),
    response: {
        [StatusCodes.OK]: Type.Object({
            _links: Type.Object({}),
            _meta: Type.Object({
                nextCursor: Type.Optional(Type.String()),
            }),
            _hits: Type.Array(eventInstanceSchema),
        }),
    },
};

const searchOptions: BuildQueryFromRawOptions<EventInstance> = {
    size: {
        default: 10,
    },
    sort: {
        allowedFields: ['_createdAt'],
        default: {
            _createdAt: SortValue.Desc,
        },
    },
    filters: {
        allowedFields: ['eventId', 'eventRunId', 'state', 'event'],
        virtualFields: [
            {
                sourceField: 'deviceId',
                mapQuery: (value) => {
                    return {
                        event: {
                            [FilterOperator.Json]: JSON.stringify({
                                triggerFilters: {
                                    deviceId: Number(value),
                                },
                            }),
                        },
                    };
                },
            },
        ],
    },
    relations: {
        allowedFields: ['_createdByUser', '_updatedByUser'],
    },
};

export const createEventInstancesRest: ApplicationPlugin = async (app) => {
    app.register(errorHandlerPlugin, { entityName: 'EventInstance' });

    app.withTypeProvider().get('/events/instances', { schema: searchEventInstancesSchema }, async (request, reply) => {
        const accessControl = createAccessControl();
        accessControl.authorize();

        const { cursor, ...rawSearchQuery } = request.query;
        const query = buildQueryFromRaw(rawSearchQuery, searchOptions);
        const searchResponse = await createEventInstancesService().searchConnection(query, cursor);

        return reply.status(StatusCodes.OK).send({
            _links: {},
            ...searchResponse,
        });
    });

    app.withTypeProvider().get('/events/instances/:id', { schema: getEventInstanceSchema }, async (request, reply) => {
        const accessControl = createAccessControl();
        accessControl.authorize();

        const service = createEventInstancesService();
        const event = await service.findByIdOrFail(request.params.id);

        return reply.status(StatusCodes.OK).send(event);
    });
};
