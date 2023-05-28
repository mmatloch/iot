import type { ApplicationPlugin } from '@common/application';
import { Type } from '@sinclair/typebox';
import { StatusCodes } from 'http-status-codes';

import { createAccessControl } from '../accessControl';
import type { RestSearchOptions } from '../apis/searchApi';
import {
    SortValue,
    createOffsetPaginationStrategy,
    createRestSearch,
    createSearchResponseSchema,
    searchQuerySchema,
} from '../apis/searchApi';
import {
    Dashboard,
    DashboardDto,
    dashboardDtoSchema,
    dashboardSchema,
    reorderDashboardsDtoSchema,
} from '../entities/dashboardEntity';
import { Errors } from '../errors';
import errorHandlerPlugin from '../plugins/errorHandlerPlugin';
import { createDashboardsService } from '../services/dashboardsService';

const createDashboardSchema = {
    body: dashboardDtoSchema,
    response: {
        [StatusCodes.CREATED]: dashboardSchema,
    },
};

const searchDashboardsSchema = {
    querystring: searchQuerySchema,
    response: {
        [StatusCodes.OK]: createSearchResponseSchema(dashboardSchema),
    },
};

const searchOptions: RestSearchOptions<Dashboard> = {
    size: {
        default: 10,
    },
    sort: {
        allowedFields: ['_createdAt', '_updatedAt'],
        default: {
            _createdAt: SortValue.Desc,
        },
    },
    filters: {
        allowedFields: ['displayName', 'userId', '_createdAt'],
    },
    pagination: {
        defaultStrategy: createOffsetPaginationStrategy(),
    },
    relations: {
        allowedFields: ['_createdByUser', '_updatedByUser'],
    },
};

const getDashboardSchema = {
    params: Type.Object({
        id: Type.Integer(),
    }),
    response: {
        [StatusCodes.OK]: dashboardSchema,
    },
};

const updateDashboardSchema = {
    params: Type.Object({
        id: Type.Integer(),
    }),
    body: Type.Partial(dashboardDtoSchema),
    response: {
        [StatusCodes.OK]: dashboardSchema,
    },
};

const deleteDashboardSchema = {
    params: Type.Object({
        id: Type.Integer(),
    }),
    response: {
        [StatusCodes.NO_CONTENT]: Type.Null(),
    },
};

const reorderDashboardsSchema = {
    body: reorderDashboardsDtoSchema,
    response: {
        [StatusCodes.NO_CONTENT]: Type.Null(),
    },
};

const updatableFields = ['displayName', 'layout'];

const checkUpdatableFields = (dashboard: Partial<DashboardDto>) => {
    Object.keys(dashboard).forEach((key) => {
        if (!updatableFields.includes(key)) {
            throw Errors.noPermissionToUpdateField({
                detail: key,
            });
        }
    });
};

export const createDashboardsRest: ApplicationPlugin = async (app) => {
    app.register(errorHandlerPlugin, { entityName: 'Dashboard' });

    app.withTypeProvider().post('/dashboards', { schema: createDashboardSchema }, async (request, reply) => {
        const accessControl = createAccessControl();
        const subject = accessControl.authorize();

        const service = createDashboardsService();
        const dashboard = await service.create({
            ...request.body,
            userId: subject.userId,
        });

        return reply.status(StatusCodes.CREATED).send(dashboard);
    });

    app.withTypeProvider().get('/dashboards', { schema: searchDashboardsSchema }, async (request, reply) => {
        const accessControl = createAccessControl();
        const subject = accessControl.authorize();

        if (request.query.filters) {
            request.query.filters['userId'] = subject.userId;
        } else {
            request.query.filters = {
                userId: subject.userId,
            };
        }

        const searchResponse = await createRestSearch(createDashboardsService()).query(request.query, searchOptions);

        return reply.status(StatusCodes.OK).send(searchResponse);
    });

    app.withTypeProvider().get('/dashboards/:id', { schema: getDashboardSchema }, async (request, reply) => {
        const accessControl = createAccessControl();
        accessControl.authorize();

        const service = createDashboardsService();
        const dashboard = await service.findByIdOrFail(request.params.id);

        accessControl.authorize({
            userId: dashboard.userId,
        });

        return reply.status(StatusCodes.OK).send(dashboard);
    });

    app.withTypeProvider().patch('/dashboards/:id', { schema: updateDashboardSchema }, async (request, reply) => {
        const accessControl = createAccessControl();
        accessControl.authorize();

        const service = createDashboardsService();
        const dashboard = await service.findByIdOrFail(request.params.id);

        accessControl.authorize({
            userId: dashboard.userId,
        });

        checkUpdatableFields(request.body);

        const updatedDashboard = await service.update(dashboard, request.body);

        return reply.status(StatusCodes.OK).send(updatedDashboard);
    });

    app.withTypeProvider().delete('/dashboards/:id', { schema: deleteDashboardSchema }, async (request, reply) => {
        const accessControl = createAccessControl();
        accessControl.authorize();

        const service = createDashboardsService();
        const dashboard = await service.findByIdOrFail(request.params.id);

        accessControl.authorize({
            userId: dashboard.userId,
        });

        await service.hardDelete(dashboard);

        return reply.status(StatusCodes.NO_CONTENT).send();
    });

    app.withTypeProvider().post('/dashboards/reorder', { schema: reorderDashboardsSchema }, async (request, reply) => {
        const accessControl = createAccessControl();
        const { userId } = accessControl.authorize();

        const service = createDashboardsService();
        await service.reorder(request.body, userId);

        return reply.status(StatusCodes.NO_CONTENT).send();
    });
};
