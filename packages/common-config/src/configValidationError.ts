import { ErrorObject } from 'ajv';

type ValidationErrorDetails = ErrorObject[] | null | undefined;

interface ValidationErrorOptions {
    details: ValidationErrorDetails;
}

export class ConfigValidationError extends Error {
    public details: ValidationErrorDetails;

    constructor({ details }: ValidationErrorOptions) {
        super('Config validation error');

        this.details = details;
    }
}
