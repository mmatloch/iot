import fs from 'node:fs';
import path from 'node:path';

import type { Static, TSchema } from '@sinclair/typebox';
import Ajv from 'ajv';
import traverseSchema, { Callback } from 'json-schema-traverse';
import _ from 'lodash';

import { ConfigValidationError } from './configValidationError';

type RawConfig = Record<string, unknown>;
type Environment = Record<string, string | undefined>;

export type ConfigHook = (config: RawConfig, opts: ConfigHookOptions) => Callback;

export interface ConfigPlugin {
    name: string;
    hooks: {
        beforeDefaults?: ConfigHook;
        afterDefaults?: ConfigHook;
    };
    keywords?: string[];
}

export interface ConfigHookOptions {
    environment: Environment;
    configDirectoryPath: string;
    nodeEnv?: string;
}

export interface ConfigOptions<T extends TSchema> {
    schema: T;
    environment?: Environment;
    configDirectoryPath?: string;
    nodeEnv?: string;
    plugins?: ConfigPlugin[];
    createValidator?: () => {
        addKeyword: (definition: string) => unknown;
        validate: <T extends TSchema>(schema: T, data: unknown) => data is Static<T>;
    };
}

const getNodeEnv = () => {
    return process.env.NODE_ENV?.toLowerCase();
};

const loadJsonFile = (filePath: string) => {
    let fileContent: string;
    try {
        fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
    } catch (e) {
        throw new Error(`Failed to read file ${filePath}`, { cause: e as Error });
    }

    try {
        return JSON.parse(fileContent);
    } catch (e) {
        throw new Error(`Failed to parse file ${filePath}`, { cause: e as Error });
    }
};

export const createConfig = <T extends TSchema>(opts: ConfigOptions<T>): Static<T> => {
    const optsWithDefaults = _.defaults(opts, {
        environment: process.env,
        nodeEnv: getNodeEnv(),
        configDirectoryPath: path.join(process.cwd(), './config'),
        plugins: [] as ConfigPlugin[],
        createValidator: () => new Ajv(),
    });

    const { schema, configDirectoryPath, nodeEnv, plugins } = optsWithDefaults;

    const validateConfig = (config: RawConfig): Static<T> => {
        const pluginsVocabulary = plugins.flatMap((p) => p.keywords).filter(_.isString);

        const validator = optsWithDefaults.createValidator();

        const addVocabulary = (definitions: string[]) => {
            definitions.forEach((def) => {
                if (!validator.RULES.keywords[def]) {
                    validator.addKeyword(def);
                }
            });
        };

        addVocabulary(['modifier', 'kind']); // typebox keywords
        addVocabulary(pluginsVocabulary);

        if (!validator.validate(schema, config)) {
            throw new ConfigValidationError({
                details: validator.errors,
            });
        }

        return config;
    };

    const loadConfigFiles = (): RawConfig => {
        if (!fs.existsSync(configDirectoryPath)) {
            throw new Error(`Directory '${configDirectoryPath}' does not exist`);
        }

        const dirContent = fs.readdirSync(configDirectoryPath, { encoding: 'utf8' });
        const config: RawConfig = {};

        _.merge(config, loadJsonFile(path.join(configDirectoryPath, 'default.json')));

        if (dirContent.includes(`${nodeEnv}.json`)) {
            _.merge(config, loadJsonFile(path.join(configDirectoryPath, `${nodeEnv}.json`)));
        }

        return config;
    };

    const processSchema = (config: RawConfig): void => {
        const hooksOpts = _.omit(optsWithDefaults, ['schema', 'plugins']);

        const isHook = (hook: ConfigHook | undefined): hook is ConfigHook => {
            return !_.isUndefined(hook);
        };

        const beforeDefaultHooks = plugins.map((p) => p.hooks.beforeDefaults).filter(isHook);
        const afterDefaultHooks = plugins.map((p) => p.hooks.afterDefaults).filter(isHook);

        beforeDefaultHooks.forEach((hook) => traverseSchema(schema, hook(config, hooksOpts)));

        // validate config to assign default values
        try {
            validateConfig(config);
            // eslint-disable-next-line no-empty
        } catch {}

        afterDefaultHooks.forEach((hook) => traverseSchema(schema, hook(config, hooksOpts)));
    };

    const rawConfig = loadConfigFiles();
    processSchema(rawConfig);
    return validateConfig(rawConfig);
};
