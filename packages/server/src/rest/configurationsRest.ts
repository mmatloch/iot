import type { ApplicationPlugin } from '@common/application';
import { Type } from '@sinclair/typebox';
import { StatusCodes } from 'http-status-codes';

import { createAccessControl } from '../accessControl';
import type {
    RestSearchOptions} from '../apis/searchApi';
import {
    SortValue,
    createOffsetPaginationStrategy,
    createRestSearch,
    createSearchResponseSchema,
    searchQuerySchema,
} from '../apis/searchApi';
import type {
    Configuration} from '../entities/configurationEntity';
import {
    configurationDtoSchema,
    configurationSchema,
    configurationUpdateSchema,
} from '../entities/configurationEntity';
import { UserRole } from '../entities/userEntity';
import { Errors } from '../errors';
import errorHandlerPlugin from '../plugins/errorHandlerPlugin';
import { createConfigurationsService } from '../services/configurationsService';

type PartialConfiguration = Partial<Configuration>;

const createConfigurationSchema = {
    body: configurationDtoSchema,
    response: {
        [StatusCodes.CREATED]: configurationSchema,
    },
};

const searchConfigurationsSchema = {
    querystring: searchQuerySchema,
    response: {
        [StatusCodes.OK]: createSearchResponseSchema(configurationSchema),
    },
};

const searchOptions: RestSearchOptions<Configuration> = {
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
        allowedFields: ['state', 'data'],
    },
    pagination: {
        defaultStrategy: createOffsetPaginationStrategy(),
    },
    relations: {
        allowedFields: ['_createdByUser', '_updatedByUser'],
    },
};

const getConfigurationSchema = {
    params: Type.Object({
        id: Type.Integer(),
    }),
    response: {
        [StatusCodes.OK]: configurationSchema,
    },
};

const updateConfigurationSchema = {
    params: Type.Object({
        id: Type.Integer(),
    }),
    body: configurationUpdateSchema,
    response: {
        [StatusCodes.OK]: configurationSchema,
    },
};

const updatableFields = ['data', 'state'];

const checkUpdatableFields = (configuration: PartialConfiguration) => {
    Object.keys(configuration).forEach((key) => {
        if (!updatableFields.includes(key)) {
            throw Errors.noPermissionToUpdateField({
                detail: key,
            });
        }
    });
};

export const createConfigurationsRest: ApplicationPlugin = async (app) => {
    app.register(errorHandlerPlugin, { entityName: 'Configuration' });

    app.withTypeProvider().post('/configurations', { schema: createConfigurationSchema }, async (request, reply) => {
        const accessControl = createAccessControl();
        accessControl.authorize({
            role: UserRole.Admin,
        });

        const service = createConfigurationsService();
        const configuration = await service.create(request.body);

        return reply.status(StatusCodes.CREATED).send(configuration);
    });

    app.withTypeProvider().get('/configurations', { schema: searchConfigurationsSchema }, async (request, reply) => {
        const accessControl = createAccessControl();
        accessControl.authorize();

        const searchResponse = await createRestSearch(createConfigurationsService()).query(
            request.query,
            searchOptions,
        );

        return reply.status(StatusCodes.OK).send(searchResponse);
    });

    app.withTypeProvider().get('/configurations/:id', { schema: getConfigurationSchema }, async (request, reply) => {
        const accessControl = createAccessControl();
        accessControl.authorize();

        const service = createConfigurationsService();
        const configuration = await service.findByIdOrFail(request.params.id);

        return reply.status(StatusCodes.OK).send(configuration);
    });

    app.withTypeProvider().patch(
        '/configurations/:id',
        { schema: updateConfigurationSchema },
        async (request, reply) => {
            const accessControl = createAccessControl();
            accessControl.authorize({
                role: UserRole.Admin,
            });

            const service = createConfigurationsService();
            const configuration = await service.findByIdOrFail(request.params.id);

            checkUpdatableFields(request.body);

            const updatedConfiguration = await service.update(configuration, request.body);

            return reply.status(StatusCodes.OK).send(updatedConfiguration);
        },
    );
};
