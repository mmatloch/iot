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
    WidgetDto,
    WidgetWithActionState,
    widgetActionDtoSchema,
    widgetDtoSchema,
    widgetWithActionStateSchema,
} from '../entities/widgetEntity';
import { Errors } from '../errors';
import errorHandlerPlugin from '../plugins/errorHandlerPlugin';
import { createWidgetsService } from '../services/widgetsService';

const createWidgetSchema = {
    body: widgetDtoSchema,
    response: {
        [StatusCodes.CREATED]: widgetWithActionStateSchema,
    },
};

const searchWidgetsSchema = {
    querystring: searchQuerySchema,
    response: {
        [StatusCodes.OK]: createSearchResponseSchema(widgetWithActionStateSchema),
    },
};

const searchOptions: RestSearchOptions<WidgetWithActionState> = {
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
        [StatusCodes.OK]: widgetWithActionStateSchema,
    },
};

const previewWidgetSchema = {
    body: widgetDtoSchema,
    response: {
        [StatusCodes.OK]: widgetWithActionStateSchema,
    },
};

const triggerWidgetActionSchema = {
    params: Type.Object({
        id: Type.Integer(),
    }),
    body: widgetActionDtoSchema,
    response: {
        [StatusCodes.NO_CONTENT]: Type.Null(),
    },
};

const deleteWidgetSchema = {
    params: Type.Object({
        id: Type.Integer(),
    }),
    response: {
        [StatusCodes.NO_CONTENT]: Type.Null(),
    },
};

const updateWidgetSchema = {
    params: Type.Object({
        id: Type.Integer(),
    }),
    body: Type.Partial(widgetDtoSchema),
    response: {
        [StatusCodes.OK]: widgetWithActionStateSchema,
    },
};

const updatableFields = ['displayName', 'icon', 'textLines', 'action'];

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

        const searchResponse = await createRestSearch<WidgetWithActionState, WidgetDto>(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            createWidgetsService() as any,
        ).query(request.query, searchOptions);

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

    app.withTypeProvider().delete('/widgets/:id', { schema: deleteWidgetSchema }, async (request, reply) => {
        const accessControl = createAccessControl();
        accessControl.authorize();

        const service = createWidgetsService();
        const widget = await service.findByIdOrFail(request.params.id);

        await service.hardDelete(widget);

        return reply.status(StatusCodes.NO_CONTENT).send();
    });

    app.withTypeProvider().post('/widgets/preview', { schema: previewWidgetSchema }, async (request, reply) => {
        const accessControl = createAccessControl();
        accessControl.authorize();

        const service = createWidgetsService();
        const widget = await service.getPreview(request.body);

        return reply.status(StatusCodes.OK).send(widget);
    });

    app.withTypeProvider().post(
        '/widgets/:id/action',
        { schema: triggerWidgetActionSchema },
        async (request, reply) => {
            const accessControl = createAccessControl();
            accessControl.authorize();

            const service = createWidgetsService();
            const widget = await service.findByIdOrFail(request.params.id);

            await service.triggerAction(widget, request.body);

            return reply.status(StatusCodes.OK).send();
        },
    );
};
