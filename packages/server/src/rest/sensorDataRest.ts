import { ApplicationPlugin } from '@common/application';
import { Type } from '@sinclair/typebox';
import { StatusCodes } from 'http-status-codes';

import { createAccessControl } from '../accessControl';
import { createSearchResponseSchema } from '../apis/searchApi';
import { sensorDataDtoSchema, sensorDataSchema } from '../entities/sensorDataEntity';
import errorHandlerPlugin from '../plugins/errorHandlerPlugin';
import { createSensorDataService } from '../services/sensorDataService';

const partialSensorDataDtoSchema = Type.Partial(sensorDataDtoSchema);

const getSensorDataSchema = {
    querystring: partialSensorDataDtoSchema,
    response: {
        [StatusCodes.OK]: createSearchResponseSchema(sensorDataSchema),
    },
};

export const createSensorDataRest: ApplicationPlugin = async (app) => {
    app.register(errorHandlerPlugin, { entityName: 'SensorData' });

    app.withTypeProvider().get('/devices/sensorData', { schema: getSensorDataSchema }, async (request, reply) => {
        const accessControl = createAccessControl(request.user);
        accessControl.authorize();

        const service = createSensorDataService();
        const searchResult = await service.search(request.query);

        return reply.status(StatusCodes.OK).send(searchResult);
    });
};
