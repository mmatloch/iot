import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import type {
    FastifyBaseLogger,
    FastifyInstance,
    FastifyServerOptions,
    RawReplyDefaultExpression,
    RawRequestDefaultExpression,
    RawServerDefault} from 'fastify';
import {
    fastify,
} from 'fastify';
import fp from 'fastify-plugin';
import Qs from 'qs';

export type RawServer = RawServerDefault;
export type DefaultLogger = FastifyBaseLogger;

export type DefaultFastifyInstance = FastifyInstance<
    RawServer,
    RawRequestDefaultExpression<RawServer>,
    RawReplyDefaultExpression<RawServer>,
    DefaultLogger
>;

export type DefaultFastifyInstanceWithTypeProvider = FastifyInstance<
    RawServer,
    RawRequestDefaultExpression<RawServer>,
    RawReplyDefaultExpression<RawServer>,
    DefaultLogger,
    TypeBoxTypeProvider
>;

export const createApplicationFromFastify = (opts: FastifyServerOptions) => {
    return fastify({
        logger: true,
        querystringParser: (str) => Qs.parse(str),
        trustProxy: true,
        disableRequestLogging: true,
        ...opts,
    });
};

export const createFastifyPlugin = fp;
