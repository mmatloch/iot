import { Plugins, createConfig } from '@common/config';
import { createValidator } from '@common/validator';
import { Type } from '@sinclair/typebox';

import { ApplicationEnv } from './constants';

const schema = Type.Object({
    app: Type.Object({
        name: Type.String(),
        urlPrefix: Type.String(),
        env: Type.Enum(ApplicationEnv, {
            environment: 'NODE_ENV',
            transform: ['toUpperCase'],
        }),
    }),
    logger: Type.Object({
        level: Type.String({
            environment: 'LOG_LEVEL',
            default: 'info',
        }),
        rotationFrequency: Type.String({
            environment: 'LOG_ROTATION_FREQUENCY',
            default: 'daily',
        }),
        logRequests: Type.Boolean({
            default: false,
        }),
        logResponses: Type.Boolean({
            default: false,
        }),
    }),
    databases: Type.Object({
        timescale: Type.Object({
            url: Type.String({
                environment: 'POSTGRES',
            }),
        }),
    }),
    mqttBroker: Type.Object({
        url: Type.String({
            environment: 'MQTT',
        }),
    }),
    authorization: Type.Object({
        jwtSecret: Type.String({
            environment: 'JWT_SECRET',
        }),
        rootUserEmail: Type.Optional(
            Type.String({
                environment: 'ROOT_USER_EMAIL',
            }),
        ),
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
    createValidator,
});

export const getConfig = () => config;
