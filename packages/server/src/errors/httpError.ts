import { STATUS_CODES } from 'http';

import { BaseError, BaseErrorOptions } from './baseError';

interface HttpErrorOptions extends BaseErrorOptions {
    statusCode: number;
}

export class HttpError extends BaseError {
    public statusCode: number;

    constructor({ message, statusCode, errorCode }: HttpErrorOptions) {
        const getHttpMessage = (statusCode: number): string => STATUS_CODES[statusCode] || 'Internal server error';
        const responseMessage = message || getHttpMessage(statusCode);

        super({ errorCode, message: responseMessage });

        this.statusCode = statusCode;
    }
}
