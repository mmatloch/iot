import { createFastifyPlugin } from './fastifyAbstract';
import { ApplicationPlugin, ApplicationPluginOptions } from './types';

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
