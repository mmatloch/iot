import { HttpError, HttpErrorOptions } from '@common/errors';

enum ErrorCode {
    GenericInternalError = 1,
    UserAlreadyExists,
}
const prefix = 'SRV';

const getErrorCode = (errorCode: ErrorCode) => `${prefix}-${errorCode}`;

export const Errors = {
    genericInternalError: (opts: Partial<HttpErrorOptions>): HttpError =>
        HttpError.internalServerError({
            ...opts,
            errorCode: getErrorCode(ErrorCode.GenericInternalError),
        }),

    userAlreadyExists: (opts: Partial<HttpErrorOptions>): HttpError =>
        HttpError.conflict({
            ...opts,
            errorCode: getErrorCode(ErrorCode.UserAlreadyExists),
        }),
};
