import { HttpError, HttpErrorOptions } from '@common/errors';

enum ErrorCode {
    GenericInternalError = 1,
    Unauthorized,
    Forbidden,
}
const prefix = 'SRV';

const getErrorCode = (errorCode: ErrorCode) => `${prefix}-${errorCode}`;

export const Errors = {
    genericInternalError: (opts: Partial<HttpErrorOptions>): HttpError =>
        HttpError.internalServerError({
            ...opts,
            errorCode: getErrorCode(ErrorCode.GenericInternalError),
        }),

    unauthorized: (opts: Partial<HttpErrorOptions>): HttpError =>
        HttpError.unauthorized({
            ...opts,
            errorCode: getErrorCode(ErrorCode.Unauthorized),
        }),

    forbidden: (): HttpError =>
        HttpError.forbidden({
            errorCode: getErrorCode(ErrorCode.Forbidden),
        }),
};
