import { Plugins, createConfig } from '@common/config';
import { Type } from '@sinclair/typebox';

import { createValidator } from './validator';

const schema = Type.Object({
    databases: Type.Object({
        timescale: Type.Object({
            url: Type.String({
                environment: 'POSTGRES',
            }),
        }),
    }),
    externalServices: Type.Object({
        google: Type.Object({
            oAuth2: Type.Object({
                scope: Type.String(),
                clientId: Type.String({
                    environment: 'GOOGLE_OAUTH2_CLIENT_ID',
                }),
                clientSecret: Type.String({
                    environment: 'GOOGLE_OAUTH2_CLIENT_SECRET',
                }),
                redirectUri: Type.String({
                    environment: 'GOOGLE_OAUTH2_REDIRECT_URI',
                }),
                authBaseUrl: Type.String({
                    environment: 'GOOGLE_OAUTH2_AUTH_BASE_URL',
                }),
                tokenUrl: Type.String({
                    environment: 'GOOGLE_OAUTH2_TOKEN_URL',
                }),
            }),
        }),
    }),
});

const config = createConfig({
    schema,
    plugins: [Plugins.envVariables],
});

export const getConfig = () => config;
