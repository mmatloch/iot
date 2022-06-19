import { StatusCodes } from 'http-status-codes';

import { HttpError } from './httpError';

interface ErrorObject {
    keyword: string;
    instancePath: string;
    schemaPath: string;
    params: Record<string, unknown>;
    propertyName?: string;
    message?: string;
    data?: unknown;
}

type ValidationErrorDetails = ErrorObject[] | null | undefined;

interface ValidationErrorOptions {
    message?: string;
    details: ValidationErrorDetails;
}

const validationErrorCode = 'VLD-1';

export class ValidationError extends HttpError {
    public details: ValidationErrorDetails;

    constructor({ details, message }: ValidationErrorOptions) {
        super({
            message: message || 'Validation error',
            errorCode: validationErrorCode,
            statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
        });

        this.details = details;
    }
}
