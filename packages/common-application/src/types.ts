import { WebsocketHandler } from '@fastify/websocket';
import {
    ContextConfigDefault,
    FastifyBaseLogger,
    FastifySchema,
    FastifyTypeProvider,
    FastifyTypeProviderDefault,
    RawReplyDefaultExpression,
    RawRequestDefaultExpression,
    RawServerBase,
    RawServerDefault,
    RequestGenericInterface,
} from 'fastify';
import type WebSocket from 'ws';

import type { DefaultFastifyInstance, DefaultFastifyInstanceWithTypeProvider } from './fastifyAbstract';

export interface Application extends Omit<DefaultFastifyInstance, 'withTypeProvider'> {
    withTypeProvider(): Omit<DefaultFastifyInstanceWithTypeProvider, 'withTypeProvider'>;
}

type DefaultPluginOptions = Record<never, never>;
export type ApplicationPluginOptions = Record<string, unknown>;

export type ApplicationPlugin<Options extends ApplicationPluginOptions = DefaultPluginOptions> = (
    instance: Application,
    opts: Options,
) => Promise<void>;

declare module 'fastify' {
    // https://github.com/fastify/fastify/issues/2110
    interface FastifyRequest extends Record<string, unknown> {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface RouteShorthandOptions<RawServer extends RawServerBase = RawServerDefault> {
        websocket?: boolean;
    }

    interface RouteShorthandMethod<
        RawServer extends RawServerBase = RawServerDefault,
        RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
        RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
        TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
    > {
        <
            RequestGeneric extends RequestGenericInterface = RequestGenericInterface,
            ContextConfig = ContextConfigDefault,
            SchemaCompiler extends FastifySchema = FastifySchema,
            Logger extends FastifyBaseLogger = FastifyBaseLogger,
        >(
            path: string,
            opts: RouteShorthandOptions<
                RawServer,
                RawRequest,
                RawReply,
                RequestGeneric,
                ContextConfig,
                SchemaCompiler,
                TypeProvider,
                Logger
            > & { websocket: true }, // this creates an overload that only applies these different types if the handler is for websockets
            handler?: WebsocketHandler<
                RawServer,
                RawRequest,
                RequestGeneric,
                ContextConfig,
                SchemaCompiler,
                TypeProvider,
                Logger
            >,
        ): FastifyInstance<RawServer, RawRequest, RawReply, Logger, TypeProvider>;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface FastifyInstance<RawServer, RawRequest, RawReply, Logger, TypeProvider> {
        websocketServer: WebSocket.Server;
    }
}
