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
import { Widget, WidgetDto, widgetDtoSchema, widgetSchema } from '../entities/widgetEntity';
import { Errors } from '../errors';
import errorHandlerPlugin from '../plugins/errorHandlerPlugin';
import { createWidgetsService } from '../services/widgetsService';

const createWidgetSchema = {
    body: widgetDtoSchema,
    response: {
        [StatusCodes.CREATED]: widgetSchema,
    },
};

const searchWidgetsSchema = {
    querystring: searchQuerySchema,
    response: {
        [StatusCodes.OK]: createSearchResponseSchema(widgetSchema),
    },
};

const searchOptions: RestSearchOptions<Widget> = {
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
        allowedFields: ['displayName', '_createdAt'],
    },
    pagination: {
        defaultStrategy: createOffsetPaginationStrategy(),
    },
    relations: {
        allowedFields: ['_createdByUser', '_updatedByUser'],
    },
};

const getWidgetSchema = {
    params: Type.Object({
        id: Type.Integer(),
    }),
    response: {
        [StatusCodes.OK]: widgetSchema,
    },
};

const updateWidgetSchema = {
    params: Type.Object({
        id: Type.Integer(),
    }),
    body: Type.Partial(widgetDtoSchema),
    response: {
        [StatusCodes.OK]: widgetSchema,
    },
};

const updatableFields = ['displayName'];

const checkUpdatableFields = (widget: Partial<WidgetDto>) => {
    Object.keys(widget).forEach((key) => {
        if (!updatableFields.includes(key)) {
            throw Errors.noPermissionToUpdateField({
                detail: key,
            });
        }
    });
};

export const createWidgetsRest: ApplicationPlugin = async (app) => {
    app.register(errorHandlerPlugin, { entityName: 'Widget' });

    app.withTypeProvider().post('/widgets', { schema: createWidgetSchema }, async (request, reply) => {
        const accessControl = createAccessControl();
        accessControl.authorize();

        const service = createWidgetsService();
        const widget = await service.create(request.body);

        return reply.status(StatusCodes.CREATED).send(widget);
    });

    app.withTypeProvider().get('/widgets', { schema: searchWidgetsSchema }, async (request, reply) => {
        const accessControl = createAccessControl();
        accessControl.authorize();

        const searchResponse = await createRestSearch(createWidgetsService()).query(request.query, searchOptions);

        return reply.status(StatusCodes.OK).send(searchResponse);
    });

    app.withTypeProvider().get('/widgets/:id', { schema: getWidgetSchema }, async (request, reply) => {
        const accessControl = createAccessControl();
        accessControl.authorize();

        const service = createWidgetsService();
        const widget = await service.findByIdOrFail(request.params.id);

        return reply.status(StatusCodes.OK).send(widget);
    });

    app.withTypeProvider().patch('/widgets/:id', { schema: updateWidgetSchema }, async (request, reply) => {
        const accessControl = createAccessControl();
        accessControl.authorize();

        const service = createWidgetsService();
        const widget = await service.findByIdOrFail(request.params.id);

        checkUpdatableFields(request.body);

        const updatedWidget = await service.update(widget, request.body);

        return reply.status(StatusCodes.OK).send(updatedWidget);
    });
};
