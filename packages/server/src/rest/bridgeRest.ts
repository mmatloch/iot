import { ApplicationPlugin } from '@common/application';
import { Type } from '@sinclair/typebox';
import { StatusCodes } from 'http-status-codes';

import { createAccessControl } from '../accessControl';
import { Errors } from '../errors';
import errorHandlerPlugin from '../plugins/errorHandlerPlugin';
import { createConfigurationsService } from '../services/configurationsService';

const requestBridgeSchema = {
    params: Type.Object({
        id: Type.Integer(),
    }),
    body: Type.Unknown(),
    response: {
        [StatusCodes.NO_CONTENT]: Type.Null(),
    },
};

export const createBridgeRest: ApplicationPlugin = async (app) => {
    app.register(errorHandlerPlugin, { entityName: 'Configuration' });

    app.withTypeProvider().put(
        '/configurations/:id/bridge',
        { schema: requestBridgeSchema },
        async (request, reply) => {
            const accessControl = createAccessControl();
            accessControl.authorize();

            const service = createConfigurationsService();
            const configuration = await service.findByIdOrFail(request.params.id);

            const dataPublisher = service.getBridgeDataPublisher(configuration);
            if (!dataPublisher.requestBridge) {
                throw Errors.cannotRequestBridgeForConfiguration(configuration.data.type);
            }

            await dataPublisher.requestBridge(request.body);

            return reply.status(StatusCodes.NO_CONTENT).send();
        },
    );
};
