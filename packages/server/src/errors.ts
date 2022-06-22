import { HttpError, HttpErrorOptions } from '@common/errors';

enum ErrorCode {
    GenericInternalError = 1,
    InvalidAuthorizationHeader,
    InvalidAccessToken,
}
const prefix = 'SRV';

const getErrorCode = (errorCode: ErrorCode) => `${prefix}-${errorCode}`;

export const Errors = {
    genericInternalError: (opts: Partial<HttpErrorOptions>): HttpError =>
        HttpError.internalServerError({
            ...opts,
            errorCode: getErrorCode(ErrorCode.GenericInternalError),
        }),

    invalidAuthorizationHeader: (): HttpError =>
        HttpError.unauthorized({
            errorCode: getErrorCode(ErrorCode.InvalidAuthorizationHeader),
        }),

    invalidAccessToken: (detail: string): HttpError =>
        HttpError.unauthorized({
            detail,
            errorCode: getErrorCode(ErrorCode.InvalidAccessToken),
        }),
};
