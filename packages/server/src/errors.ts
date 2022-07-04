import { HttpError, HttpErrorOptions } from '@common/errors';

enum ErrorCode {
    GenericInternalError = 1,
    Unauthorized,
    Forbidden,
    CannotCreateTokenForUser,
    EntityNotFound,
    EntityAlreadyExists,
    NoPermissionToUpdateField,
    FailedToRunCondition,
    FailedToRunAction,
    EventTriggerCircularReference,
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

    entityNotFound: (entityName: string, opts: Partial<HttpErrorOptions>): HttpError =>
        HttpError.notFound({
            ...opts,
            errorCode: getErrorCode(ErrorCode.EntityNotFound),
            message: `${entityName} does not exist`,
        }),

    entityAlreadyExists: (entityName: string, opts: Partial<HttpErrorOptions>): HttpError =>
        HttpError.conflict({
            ...opts,
            message: `${entityName} already exists`,
            errorCode: getErrorCode(ErrorCode.EntityAlreadyExists),
        }),

    noPermissionToUpdateField: (opts: Partial<HttpErrorOptions>): HttpError =>
        HttpError.forbidden({
            ...opts,
            errorCode: getErrorCode(ErrorCode.NoPermissionToUpdateField),
            message: `You don't have permission to update this field`,
        }),

    failedToRunCondition: (opts: Partial<HttpErrorOptions>): HttpError =>
        HttpError.internalServerError({
            ...opts,
            errorCode: getErrorCode(ErrorCode.FailedToRunCondition),
            message: `Error occurred during the event condition`,
        }),

    failedToRunAction: (opts: Partial<HttpErrorOptions>): HttpError =>
        HttpError.internalServerError({
            ...opts,
            errorCode: getErrorCode(ErrorCode.FailedToRunAction),
            message: `Error occurred during the event action`,
        }),

    eventTriggerCircularReference: (eventId: number, opts?: Partial<HttpErrorOptions>): HttpError =>
        HttpError.unprocessableEntity({
            ...opts,
            errorCode: getErrorCode(ErrorCode.EventTriggerCircularReference),
            message: `Circular reference in the event trigger chain`,
            detail: `Detected that event ${eventId} is trying to run again in the same event chain. This is regarded as undesirable because it can lead to an infinite loop`,
        }),
};
