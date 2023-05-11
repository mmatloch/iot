import type { IncomingMessage } from 'http';
import { join } from 'path';

import { ValidationError, transformError } from '@common/errors';
import type { Logger } from '@common/logger';
import { createValidator } from '@common/validator';
import formBody from '@fastify/formbody';
import staticPlugin from '@fastify/static';
import _ from 'lodash';

import { createApplicationFromFastify } from './fastifyAbstract';
import type { LoggerPluginOptions } from './plugins/loggerPlugin';
import loggerPlugin from './plugins/loggerPlugin';
import statusPlugin from './plugins/statusPlugin';
import type { Application } from './types';

interface CreateApplicationOptions {
    logger: Logger;
    loggerOptions: LoggerPluginOptions;
    urlPrefix: string;
    staticFilesPath?: string;
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
        return new ValidationError({ details: errors, message: `Validation error in '${dataVar}'` });
    });

    app.register(formBody);
    app.register(loggerPlugin, opts.loggerOptions);
    app.register(statusPlugin);

    if (opts.staticFilesPath) {
        app.register(staticPlugin, {
            root: opts.staticFilesPath,
            prefix: '/static',
            prefixAvoidTrailingSlash: true,
            list: true,
            index: false,
        });
    }
};

// https://github.com/yarnpkg/berry/blob/2cf0a8fe3e4d4bd7d4d344245d24a85a45d4c5c9/packages/yarnpkg-pnp/sources/loader/applyPatch.ts#L414-L435
const suppressExperimentalWarning = () => {
    const originalEmit = process.emit;

    const messages = ['The Fetch API is an experimental feature'];

    // @ts-expect-error - TS complains about the return type of originalEmit.apply
    process.emit = function (name, data) {
        if (name === `warning` && _.get(data, 'name') === 'ExperimentalWarning') {
            const warningMessage = _.get(data, 'message') as unknown as string | undefined;

            const hasWarningMessage = messages.some((message) => warningMessage?.includes(message));

            if (hasWarningMessage) {
                return false;
            }
        }

        // eslint-disable-next-line prefer-rest-params
        return originalEmit.apply(process, arguments as unknown as Parameters<typeof process.emit>);
    };
};

export const createApplication = async (opts: CreateApplicationOptions): Promise<Application> => {
    const rewriteUrl = (req: IncomingMessage) => {
        const { url } = req;

        if (!url) {
            return '/';
        }

        if (url.startsWith(opts.urlPrefix)) {
            const newUrl = url.substring(opts.urlPrefix.length);

            return newUrl || '/';
        }

        return url;
    };

    suppressExperimentalWarning();

    const app = createApplicationFromFastify({
        logger: opts.logger,
        rewriteUrl,
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
