import type { ApplicationPlugin } from '@common/application';
import { Type } from '@sinclair/typebox';
import { StatusCodes } from 'http-status-codes';

import { createAccessControl } from '../accessControl';
import { FilterOperator } from '../apis/search/searchDefinitions';
import type { RestSearchOptions } from '../apis/searchApi';
import {
    SortValue,
    createOffsetPaginationStrategy,
    createRestSearch,
    createSearchResponseSchema,
    searchQuerySchema,
} from '../apis/searchApi';
import { EventInstance, eventInstanceSchema } from '../entities/eventInstanceEntity';
import { UserRole } from '../entities/userEntity';
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
    querystring: searchQuerySchema,
    response: {
        [StatusCodes.OK]: createSearchResponseSchema(eventInstanceSchema),
    },
};

const searchOptions: RestSearchOptions<EventInstance> = {
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
    pagination: {
        defaultStrategy: createOffsetPaginationStrategy(),
    },
    relations: {
        allowedFields: ['_createdByUser', '_updatedByUser'],
    },
};

export const createEventInstancesRest: ApplicationPlugin = async (app) => {
    app.register(errorHandlerPlugin, { entityName: 'EventInstance' });

    app.withTypeProvider().get('/events/instances', { schema: searchEventInstancesSchema }, async (request, reply) => {
        const accessControl = createAccessControl();
        accessControl.authorize({
            role: UserRole.Admin,
        });

        const searchResponse = await createRestSearch(createEventInstancesService()).query(
            request.query,
            searchOptions,
        );

        return reply.status(StatusCodes.OK).send(searchResponse);
    });

    app.withTypeProvider().get('/events/instances/:id', { schema: getEventInstanceSchema }, async (request, reply) => {
        const accessControl = createAccessControl();
        accessControl.authorize();

        const service = createEventInstancesService();
        const event = await service.findByIdOrFail(request.params.id);

        return reply.status(StatusCodes.OK).send(event);
    });
};
