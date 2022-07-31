import { ValidationError, transformError } from '@common/errors';
import type { Logger } from '@common/logger';
import { createValidator } from '@common/validator';
import formBody from '@fastify/formbody';

import { createApplicationFromFastify } from './fastifyAbstract';
import loggerPlugin, { LoggerPluginOptions } from './plugins/loggerPlugin';
import statusPlugin from './plugins/statusPlugin';
import { Application } from './types';

interface CreateApplicationOptions {
    logger: Logger;
    loggerOptions: LoggerPluginOptions;
    hooks?: {
        beforeReady?: (app: Application) => Promise<void>;
        beforeBootstrap?: (app: Application) => Promise<void>;
    };
}

const bootstrapApplication = (app: Application, opts: CreateApplicationOptions) => {
    app.setErrorHandler(async (error, _request, reply) => {
        const { statusCode, body, headers } = transformError(error);

        return reply.status(statusCode).headers(headers).send(JSON.stringify(body));
    });

    app.setValidatorCompiler(({ schema }) => {
        const validator = createValidator();
        return validator.compile(schema);
    });

    app.setSchemaErrorFormatter((errors, dataVar) => {
        // @ts-expect-error fastify types mismatch
        return new ValidationError({ details: errors, message: `Validation error in '${dataVar}'` });
    });

    app.register(formBody);
    app.register(loggerPlugin, opts.loggerOptions);
    app.register(statusPlugin);
};

export const createApplication = async (opts: CreateApplicationOptions): Promise<Application> => {
    const app = createApplicationFromFastify({
        logger: opts.logger,
    });

    if (opts.hooks?.beforeBootstrap) {
        await opts.hooks.beforeBootstrap(app);
        await app.after();
    }

    bootstrapApplication(app, opts);
    await app.after();

    if (opts.hooks?.beforeReady) {
        await opts.hooks.beforeReady(app);
    }

    try {
        await app.listen({ port: 3000, host: '0.0.0.0' });
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }

    return app;
};
