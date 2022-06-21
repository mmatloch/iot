import { createConfig } from '@common/config';
import { Type } from '@sinclair/typebox';

const resourceConfigSchema = Type.Object({
    path: Type.String(),
    baseUrl: Type.String(),
});

const schema = Type.Object({
    resources: Type.Object({
        users: resourceConfigSchema,
        googleOAuth2AuthorizationCode: resourceConfigSchema,
    }),
});

const config = createConfig({
    schema,
});

export const getConfig = () => config;
