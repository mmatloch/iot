import { Type } from '@sinclair/typebox';

import { createConfig } from './configBuilder/configBuilder';
import { configEnvVariablesPlugin } from './configBuilder/plugins/configEnvVariables';

const schema = Type.Object({
    database: Type.Object({
        timescale: Type.Object({
            url: Type.String({
                environment: 'POSTGRES',
            }),
        }),
    }),
});

const config = createConfig({ schema, plugins: [configEnvVariablesPlugin] });

export const getConfig = () => config;
