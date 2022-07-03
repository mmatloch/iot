import { ApplicationPlugin, createApplicationPlugin } from '@common/application';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

import { Errors } from '../errors';

interface ErrorHandlerPluginOptions extends Record<string, unknown> {
    entityName: string;
}

const errorHandlerPlugin: ApplicationPlugin<ErrorHandlerPluginOptions> = async (app, { entityName }) => {
    app.setErrorHandler(async (error) => {
        if (error instanceof EntityNotFoundError) {
            throw Errors.entityNotFound(entityName, {
                cause: error,
            });
        }

        if (error instanceof QueryFailedError) {
            switch (error.code) {
                case '23505': {
                    throw Errors.entityAlreadyExists(entityName, {
                        detail: error.driverError.detail,
                        cause: error,
                    });
                }
            }
        }

        throw error;
    });
};

export default createApplicationPlugin(errorHandlerPlugin, {
    name: 'ErrorHandler',
});
