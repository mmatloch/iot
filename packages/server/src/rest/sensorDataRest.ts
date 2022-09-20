import { ApplicationPlugin } from '@common/application';
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
import { SensorData, sensorDataSchema } from '../entities/sensorDataEntity';
import errorHandlerPlugin from '../plugins/errorHandlerPlugin';
import { createSensorDataService } from '../services/sensorDataService';

const getSensorDataSchema = {
    querystring: searchQuerySchema,
    response: {
        [StatusCodes.OK]: createSearchResponseSchema(sensorDataSchema),
    },
};

const searchOptions: RestSearchOptions<SensorData> = {
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
        allowedFields: ['deviceId'],
    },
    pagination: {
        defaultStrategy: createOffsetPaginationStrategy(),
    },
    relations: {
        allowedFields: ['_createdByUser', '_updatedByUser'],
    },
};

export const createSensorDataRest: ApplicationPlugin = async (app) => {
    app.register(errorHandlerPlugin, { entityName: 'SensorData' });

    app.withTypeProvider().get('/devices/sensorData', { schema: getSensorDataSchema }, async (request, reply) => {
        const accessControl = createAccessControl();
        accessControl.authorize();

        const searchResponse = await createRestSearch(createSensorDataService()).query(request.query, searchOptions);

        return reply.status(StatusCodes.OK).send(searchResponse);
    });
};
