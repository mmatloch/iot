import { ValidationError } from '@common/errors';
import { createValidator } from '@common/validator';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import createFastify, {
    FastifyInstance as Fastify,
    FastifyLoggerInstance,
    RawReplyDefaultExpression,
    RawRequestDefaultExpression,
    RawServerDefault,
} from 'fastify';

import { transformError } from './errorTransformer';

export type Application = Fastify<
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression<RawServerDefault>,
    FastifyLoggerInstance,
    TypeBoxTypeProvider
>;

interface CreateApplicationOptions {
    hooks?: {
        beforeListen?: (app: Application) => Promise<void>;
        afterListen?: (app: Application) => Promise<void>;
    };
}

export const createApplication = async (opts: CreateApplicationOptions): Promise<Application> => {
    const app = createFastify({
        logger: true,
    }).withTypeProvider<TypeBoxTypeProvider>();

    app.setValidatorCompiler(({ schema }) => {
        const validator = createValidator();
        return validator.compile(schema);
    });

    app.setSchemaErrorFormatter((errors, dataVar) => {
        console.log(dataVar, errors);

        // @ts-expect-error fastify types mismatch
        return new ValidationError({ details: errors, message: `Validation error in '${dataVar}'` });
    });

    app.setErrorHandler((error, _request, reply) => {
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

    if (opts.hooks?.beforeListen) {
        await opts.hooks.beforeListen(app);
    }

    try {
        await app.listen({ port: 3000, host: '0.0.0.0' });
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }

    if (opts.hooks?.afterListen) {
        await opts.hooks.afterListen(app);
    }

    return app;
};
