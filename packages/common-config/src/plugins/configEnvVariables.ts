import JsonPointer from 'jsonpointer';
import _ from 'lodash';

import type { ConfigHook, ConfigPlugin } from '../config';
import { schemaPtrToConfigPtr } from '../configUtils';

const parseValueToSchemaType = (
    value: string,
    schemaType: string,
): number | boolean | string | (number | string | boolean)[] => {
    switch (schemaType) {
        case 'integer':
        case 'number':
        case 'boolean':
        case 'array': {
            try {
                return JSON.parse(value);
            } catch (e) {
                throw new Error(`Failed to parse ${value}`, { cause: e as Error });
            }
        }

        case 'string':
            return value;
        default:
            throw new Error(`Cannot parse '${value}', because its schema type is not supported (${schemaType})`);
    }
};

const hook: ConfigHook = (config, opts) => {
    return (schema, propertyPath) => {
        if (!_.isString(schema.environment)) {
            return;
        }

        if (!_.isString(schema.type)) {
            throw new Error(`The schema with environment variable '${schema.environment}' is missing a type`);
        }

        const envValue = opts.environment[schema.environment];

        if (envValue) {
            const parsedEnvValue = parseValueToSchemaType(envValue, schema.type);

            JsonPointer.set(config, schemaPtrToConfigPtr(propertyPath), parsedEnvValue);
        }
    };
};

export const configEnvVariablesPlugin: ConfigPlugin = {
    name: 'envVariables',
    hooks: {
        beforeDefaults: hook,
    },
    keywords: ['environment'],
};
