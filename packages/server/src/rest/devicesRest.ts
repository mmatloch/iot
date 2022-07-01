import { ApplicationPlugin } from '@common/application';
import { StatusCodes } from 'http-status-codes';

import { createAccessControl } from '../accessControl';
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
};
