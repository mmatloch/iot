import { ValidationError } from '@common/errors';
import { createValidator } from '@common/validator';
import formBody from '@fastify/formbody';

import { transformError } from './errorTransformer';
import { createApplicationFromFastify, createFastifyPlugin } from './fastifyAbstract';
import { Application, ApplicationPlugin, ApplicationPluginOptions } from './types';

interface CreateApplicationOptions {
    hooks?: {
        beforeReady?: (app: Application) => Promise<void>;
        afterReady?: (app: Application) => Promise<void>;
    };
}

const bootstrapApplication = (app: Application) => {
    app.setErrorHandler(async (error, _request, reply) => {
        const { statusCode, body, headers } = transformError(error);

        app.log.error({
            response: {
                statusCode,
                headers,
                body,
            },
            msg: 'Error',
        });

        return reply.status(statusCode).headers(headers).send(body);
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
};

export const createApplication = async (opts: CreateApplicationOptions): Promise<Application> => {
    const app = createApplicationFromFastify();

    bootstrapApplication(app);
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

    if (opts.hooks?.afterReady) {
        await opts.hooks.afterReady(app);
    }

    return app;
};

interface CreateApplicationPluginOptions {
    name: string;
    dependencies?: string[];
}

export const createApplicationPlugin = <PluginOptions extends ApplicationPluginOptions>(
    plugin: ApplicationPlugin<PluginOptions>,
    opts: CreateApplicationPluginOptions,
) => {
    return createFastifyPlugin(plugin, opts);
};
