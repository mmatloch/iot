import { ApplicationPlugin } from '@common/application';
import { Type } from '@sinclair/typebox';
import { StatusCodes } from 'http-status-codes';

import { createAccessControl } from '../accessControl';
import {
    RestSearchOptions,
    SortValue,
    createOffsetPaginationStrategy,
    createRestSearch,
    createSearchResponseSchema,
    searchQuerySchema,
} from '../apis/searchApi';
import { Device, deviceDtoSchema, deviceSchema } from '../entities/deviceEntity';
import { UserRole } from '../entities/userEntity';
import errorHandlerPlugin from '../plugins/errorHandlerPlugin';
import { createDevicesService } from '../services/devicesService';

const createDeviceSchema = {
    body: deviceDtoSchema,
    response: {
        [StatusCodes.CREATED]: deviceSchema,
    },
};

const searchDevicesSchema = {
    querystring: searchQuerySchema,
    response: {
        [StatusCodes.OK]: createSearchResponseSchema(deviceSchema),
    },
};

const searchOptions: RestSearchOptions<Device> = {
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
        allowedFields: [
            'deactivatedBy',
            'description',
            'displayName',
            'ieeeAddress',
            'manufacturer',
            'model',
            'powerSource',
            'protocol',
            'type',
            'vendor',
            'state',
            '_createdAt',
        ],
    },
    pagination: {
        defaultStrategy: createOffsetPaginationStrategy(),
    },
    relations: {
        allowedFields: ['_createdByUser', '_updatedByUser'],
    },
};

const getDeviceSchema = {
    params: Type.Object({
        id: Type.Integer(),
    }),
    response: {
        [StatusCodes.OK]: deviceSchema,
    },
};

export const createDevicesRest: ApplicationPlugin = async (app) => {
    app.register(errorHandlerPlugin, { entityName: 'Device' });

    app.withTypeProvider().post('/devices', { schema: createDeviceSchema }, async (request, reply) => {
        const accessControl = createAccessControl();
        accessControl.authorize({
            role: UserRole.Admin,
        });

        const service = createDevicesService();
        const device = await service.create(request.body);

        return reply.status(StatusCodes.CREATED).send(device);
    });

    app.withTypeProvider().get('/devices', { schema: searchDevicesSchema }, async (request, reply) => {
        const accessControl = createAccessControl();
        accessControl.authorize();

        const searchResponse = await createRestSearch(createDevicesService()).query(request.query, searchOptions);

        return reply.status(StatusCodes.OK).send(searchResponse);
    });

    app.withTypeProvider().get('/devices/:id', { schema: getDeviceSchema }, async (request, reply) => {
        const accessControl = createAccessControl();
        accessControl.authorize();

        const service = createDevicesService();
        const device = await service.findByIdOrFail(request.params.id);

        return reply.status(StatusCodes.OK).send(device);
    });
};
