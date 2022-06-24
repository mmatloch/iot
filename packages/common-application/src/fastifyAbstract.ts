import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import {
    FastifyInstance,
    FastifyLoggerInstance,
    RawReplyDefaultExpression,
    RawRequestDefaultExpression,
    RawServerDefault,
    fastify,
} from 'fastify';
import fp from 'fastify-plugin';
import _ from 'lodash';
import Qs from 'qs';

export type RawServer = RawServerDefault;
export type DefaultLogger = FastifyLoggerInstance;

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

export const createApplicationFromFastify = () => {
    return fastify({
        logger: true,
        querystringParser: (str) => Qs.parse(str),
    });
};

export const createFastifyPlugin = fp;
