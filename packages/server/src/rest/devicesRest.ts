import { ApplicationPlugin } from '@common/application';
import { Type } from '@sinclair/typebox';
import { StatusCodes } from 'http-status-codes';

import { createAccessControl } from '../accessControl';
import { createSearchResponseSchema } from '../apis/searchApi';
import { deviceDtoSchema, deviceSchema } from '../entities/deviceEntity';
import { UserRole } from '../entities/userEntity';
import errorHandlerPlugin from '../plugins/errorHandlerPlugin';
import { createDevicesService } from '../services/devicesService';

const createDeviceSchema = {
    body: deviceDtoSchema,
    response: {
        [StatusCodes.OK]: deviceSchema,
    },
};

const partialDeviceDtoSchema = Type.Partial(deviceDtoSchema);

const searchDevicesSchema = {
    querystring: partialDeviceDtoSchema,
    response: {
        [StatusCodes.OK]: createSearchResponseSchema(deviceSchema),
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
        const accessControl = createAccessControl(request.user);
        accessControl.authorize({
            role: UserRole.Admin,
        });

        const service = createDevicesService();
        const device = await service.create(request.body);

        return reply.status(StatusCodes.CREATED).send(device);
    });

    app.withTypeProvider().get('/devices', { schema: searchDevicesSchema }, async (request, reply) => {
        const accessControl = createAccessControl(request.user);
        accessControl.authorize();

        const service = createDevicesService();
        const searchResult = await service.search(request.query);

        return reply.status(StatusCodes.OK).send(searchResult);
    });

    app.withTypeProvider().get('/devices/:id', { schema: getDeviceSchema }, async (request, reply) => {
        const accessControl = createAccessControl(request.user);
        accessControl.authorize();

        const service = createDevicesService();
        const device = await service.findByIdOrFail(request.params.id);

        return reply.status(StatusCodes.OK).send(device);
    });
};
