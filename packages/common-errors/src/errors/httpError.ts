import { ReasonPhrases, StatusCodes, getReasonPhrase } from 'http-status-codes';

import { BaseError, BaseErrorOptions } from './baseError';

export interface HttpErrorOptions extends BaseErrorOptions {
    statusCode: number;
}

export class HttpError extends BaseError {
    public statusCode: number;

    constructor({ message, statusCode, ...opts }: HttpErrorOptions) {
        const getHttpMessage = (statusCode: number): string =>
            getReasonPhrase(statusCode) || ReasonPhrases.INTERNAL_SERVER_ERROR;

        const responseMessage = message || getHttpMessage(statusCode);

        super({ message: responseMessage, ...opts });

        this.statusCode = statusCode;
    }

    static unauthorized = (opts: BaseErrorOptions) =>
        new this({
            ...opts,
            statusCode: StatusCodes.UNAUTHORIZED,
        });

    static forbidden = (opts: BaseErrorOptions) =>
        new this({
            ...opts,
            statusCode: StatusCodes.FORBIDDEN,
        });

    static notFound = (opts: BaseErrorOptions) =>
        new this({
            ...opts,
            statusCode: StatusCodes.NOT_FOUND,
        });

    static conflict = (opts: BaseErrorOptions) =>
        new this({
            ...opts,
            statusCode: StatusCodes.CONFLICT,
        });

    static unprocessableEntity = (opts: BaseErrorOptions) =>
        new this({
            ...opts,
            statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
        });

    static internalServerError = (opts: BaseErrorOptions) =>
        new this({
            ...opts,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        });
}
