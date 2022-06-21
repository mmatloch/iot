import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import type {
    FastifyInstance,
    FastifyLoggerInstance,
    FastifyPluginAsync,
    FastifyPluginOptions,
    RawReplyDefaultExpression,
    RawRequestDefaultExpression,
    RawServerDefault,
} from 'fastify';

export interface Application
    extends Omit<
        FastifyInstance<
            RawServerDefault,
            RawRequestDefaultExpression<RawServerDefault>,
            RawReplyDefaultExpression<RawServerDefault>,
            FastifyLoggerInstance,
            TypeBoxTypeProvider
        >,
        'register' | 'withTypeProvider'
    > {
    register: ApplicationRegister;
    withTypeProvider(): Application;
}

type DefaultPluginOptions = Record<never, never>;

export type ApplicationPlugin<Options extends ApplicationPluginOptions = DefaultPluginOptions> = FastifyPluginAsync<
    Options,
    RawServerDefault,
    TypeBoxTypeProvider
>;
export type ApplicationPluginOptions = FastifyPluginOptions;

export type ApplicationRegister = <Options extends ApplicationPluginOptions = DefaultPluginOptions>(
    plugin: ApplicationPlugin<Options>,
    opts?: Options,
) => Application;

// https://github.com/fastify/fastify/issues/3636
declare module 'fastify' {
    function fastify(opts?: FastifyServerOptions<RawServerDefault, FastifyLoggerInstance>): Application;
}
