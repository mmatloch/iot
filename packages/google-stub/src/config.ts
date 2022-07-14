import { Plugins, createConfig } from '@common/config';
import { createValidator } from '@common/validator';
import { Type } from '@sinclair/typebox';

const schema = Type.Object({
    app: Type.Object({
        name: Type.String(),
    }),
    logger: Type.Object({
        level: Type.String({
            default: 'info',
        }),
        rotationFrequency: Type.String({
            default: 'daily',
        }),
    }),
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
    createValidator,
    schema,
    plugins: [Plugins.envVariables],
});

export const getConfig = () => config;
