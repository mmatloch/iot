import { Plugins, createConfig } from '@common/config';
import { Type } from '@sinclair/typebox';

const schema = Type.Object({
    oAuth2: Type.Object({
        clientId: Type.String({
            environment: 'OAUTH2_CLIENT_ID',
        }),
        clientSecret: Type.String({
            environment: 'OAUTH2_CLIENT_SECRET',
        }),
    }),
});

const config = createConfig({
    schema,
    plugins: [Plugins.envVariables],
});

export const getConfig = () => config;
