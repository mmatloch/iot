import type { BaseErrorOptions, HttpErrorOptions } from '@common/errors';
import { BaseError, HttpError } from '@common/errors';

export enum ErrorCode {
    GenericInternalError = 1,
    Unauthorized,
    Forbidden,
    CannotCreateTokenForUser,
    EntityNotFound,
    EntityAlreadyExists,
    NoPermissionToUpdateField,
    FailedToRunCondition,
    FailedToRunAction,
    ConditionNotMet,
    EventTriggerCircularReference,
    InvalidEventMetadata,
    FailedToTriggerEvent,
    NoDataPublisherForConfiguration,
    CannotRequestBridgeForConfiguration,
    CannotUpdateDeviceState,
    UnsupportedActionType,
    FailedToRunWidgetCode,
    InvalidWidgetAction,
}

const prefix = 'SRV';

export const getErrorCode = (errorCode: ErrorCode) => `${prefix}-${errorCode}`;

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

    failedToRunCondition: (displayName: string, opts: Partial<BaseErrorOptions>): BaseError =>
        new BaseError({
            ...opts,
            errorCode: getErrorCode(ErrorCode.FailedToRunCondition),
            message: `Error occurred during the '${displayName}' event condition`,
        }),

    failedToRunAction: (displayName: string, opts: Partial<BaseErrorOptions>): BaseError =>
        new BaseError({
            ...opts,
            errorCode: getErrorCode(ErrorCode.FailedToRunAction),
            message: `Error occurred during the '${displayName}' event action`,
        }),

    conditionNotMet: (opts?: Partial<BaseErrorOptions>): BaseError =>
        new BaseError({
            ...opts,
            errorCode: getErrorCode(ErrorCode.ConditionNotMet),
            message: `Condition not met`,
        }),

    eventTriggerCircularReference: (
        eventId: number,
        triggeredByEvent?: number,
        previouslyTriggeredByEvent?: number,
    ): BaseError => {
        let eventMsg = `event ${eventId}`;

        if (triggeredByEvent) {
            eventMsg += `, triggered by event ${triggeredByEvent}`;
        }

        if (previouslyTriggeredByEvent) {
            eventMsg += `, previously triggered by event ${previouslyTriggeredByEvent}`;
        }

        return new BaseError({
            errorCode: getErrorCode(ErrorCode.EventTriggerCircularReference),
            message: `Circular reference in the event trigger chain`,
            detail: `Detected that ${eventMsg} is trying to run again in the same event chain. This is regarded as undesirable because it can lead to an infinite loop`,
        });
    },

    invalidEventMetadata: (detail: string, opts?: Partial<HttpErrorOptions>): HttpError =>
        HttpError.unprocessableEntity({
            ...opts,
            errorCode: getErrorCode(ErrorCode.InvalidEventMetadata),
            message: `Invalid event metadata`,
            detail,
        }),

    failedToTriggerEvent: (displayName: string, opts?: Partial<HttpErrorOptions>): HttpError =>
        HttpError.unprocessableEntity({
            ...opts,
            errorCode: getErrorCode(ErrorCode.FailedToTriggerEvent),
            message: `Failed to trigger the '${displayName}' event`,
        }),

    noDataPublisherForConfiguration: (configurationType: string, opts?: Partial<HttpErrorOptions>): HttpError =>
        HttpError.notFound({
            ...opts,
            errorCode: getErrorCode(ErrorCode.NoDataPublisherForConfiguration),
            message: `No data publisher for configuration with type '${configurationType}'`,
        }),

    cannotRequestBridgeForConfiguration: (configurationType: string, opts?: Partial<HttpErrorOptions>): HttpError =>
        HttpError.conflict({
            ...opts,
            errorCode: getErrorCode(ErrorCode.CannotRequestBridgeForConfiguration),
            message: `Cannot request bridge for configuration with type '${configurationType}'`,
        }),

    cannotUpdateDeviceState: (opts: Partial<HttpErrorOptions>): HttpError =>
        HttpError.conflict({
            ...opts,
            errorCode: getErrorCode(ErrorCode.CannotUpdateDeviceState),
            message: `Cannot update the state of the device`,
        }),

    unsupportedActionType: (opts: Partial<HttpErrorOptions>): HttpError =>
        HttpError.conflict({
            ...opts,
            errorCode: getErrorCode(ErrorCode.UnsupportedActionType),
            message: `Unsupported action type`,
        }),

    failedToRunWidgetCode: (opts: Partial<HttpErrorOptions>): BaseError =>
        HttpError.internalServerError({
            ...opts,
            errorCode: getErrorCode(ErrorCode.FailedToRunWidgetCode),
            message: 'Failed to run widget code',
        }),
    invalidWidgetAction: (opts: Partial<HttpErrorOptions>): BaseError =>
        HttpError.unprocessableEntity({
            ...opts,
            errorCode: getErrorCode(ErrorCode.InvalidWidgetAction),
            message: 'Invalid widget action',
        }),
};
