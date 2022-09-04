export enum ServerErrorCode {
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
}

const prefix = 'SRV';

export const getServerErrorCode = (errorCode: ServerErrorCode) => `${prefix}-${errorCode}`;
