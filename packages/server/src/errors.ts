import { HttpError, HttpErrorOptions } from '@common/errors';

enum ErrorCode {
    GenericInternalError = 1,
    Unauthorized,
    Forbidden,
    CannotCreateTokenForUser,
    UserNotFound,
    UserAlreadyExists,
    NoPermissionToUpdateField,
}

const prefix = 'SRV';

const getErrorCode = (errorCode: ErrorCode) => `${prefix}-${errorCode}`;

export const Errors = {
    genericInternalError: (opts: Partial<HttpErrorOptions>): HttpError =>
        HttpError.internalServerError({
            ...opts,
            errorCode: getErrorCode(ErrorCode.GenericInternalError),
        }),

    unauthorized: (opts?: Partial<HttpErrorOptions>): HttpError =>
        HttpError.unauthorized({
            ...opts,
            errorCode: getErrorCode(ErrorCode.Unauthorized),
        }),

    forbidden: (): HttpError =>
        HttpError.forbidden({
            errorCode: getErrorCode(ErrorCode.Forbidden),
        }),

    cannotCreateTokenForUser: (opts: Partial<HttpErrorOptions>): HttpError =>
        HttpError.conflict({
            ...opts,
            errorCode: getErrorCode(ErrorCode.CannotCreateTokenForUser),
            message: `Can't create access token for this user`,
        }),

    userNotFound: (opts: Partial<HttpErrorOptions>): HttpError =>
        HttpError.notFound({
            ...opts,
            errorCode: getErrorCode(ErrorCode.UserNotFound),
            message: 'User does not exist',
        }),

    userAlreadyExists: (opts: Partial<HttpErrorOptions>): HttpError =>
        HttpError.conflict({
            ...opts,
            errorCode: getErrorCode(ErrorCode.UserAlreadyExists),
        }),

    noPermissionToUpdateField: (opts: Partial<HttpErrorOptions>): HttpError =>
        HttpError.forbidden({
            ...opts,
            errorCode: getErrorCode(ErrorCode.NoPermissionToUpdateField),
            message: `You don't have permission to update this field`,
        }),
};
