import { Plugins, createConfig } from '@common/config';
import { Type } from '@sinclair/typebox';

const resourceConfigSchema = Type.Object({
    path: Type.String(),
    baseUrl: Type.String(),
});

const schema = Type.Object({
    authorization: Type.Object({
        jwtSecret: Type.String({
            environment: 'JWT_SECRET',
        }),
    }),
    resources: Type.Object({
        users: resourceConfigSchema,
        googleOAuth2AuthorizationCode: resourceConfigSchema,
    }),
});

const config = createConfig({
    schema,
    plugins: [Plugins.envVariables],
});

export const getConfig = () => config;
