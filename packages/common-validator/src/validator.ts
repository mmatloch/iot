import { ValidationError } from '@common/errors';
import type { Static, TSchema } from '@sinclair/typebox';
import type { JSONSchemaType, Options, Schema } from 'ajv';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addKeywords from 'ajv-keywords';

interface ValidateOrThrowOptions {
    includeDataInError?: boolean;
}

export class Validator extends Ajv {
    validateOrThrow<T extends TSchema>(
        schema: T,
        data: unknown,
        opts?: ValidateOrThrowOptions,
    ): asserts data is Static<T>;
    validateOrThrow<T>(
        schema: Schema | JSONSchemaType<T> | string,
        data: unknown,
        opts?: ValidateOrThrowOptions,
    ): asserts data is T {
        if (!this.validate<T>(schema, data)) {
            throw new ValidationError({
                details: this.errors,
                validatedData: opts?.includeDataInError ? data : undefined,
            });
        }
    }
}

export const createValidator = (opts?: Options) => {
    const ajv = new Validator({
        strict: true,
        removeAdditional: false,
        useDefaults: true,
        coerceTypes: true,
        ...opts,
    });

    addFormats(ajv);
    addKeywords(ajv);

    ajv.addVocabulary(['modifier', 'kind']);

    return ajv;
};
