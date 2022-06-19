import { configEnvVariablesPlugin } from './plugins/configEnvVariables';

export * from './config';

const Plugins = {
    envVariables: configEnvVariablesPlugin,
};

export { Plugins };
