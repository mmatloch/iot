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
}
