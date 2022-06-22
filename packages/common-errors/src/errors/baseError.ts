export interface BaseErrorOptions {
    errorCode: string;
    message?: string;
    cause?: unknown;
    detail?: string;
}

export class BaseError extends Error {
    public errorCode;
    public cause;
    public detail;

    constructor({ errorCode, message, cause, detail }: BaseErrorOptions) {
        super(message);
        Object.setPrototypeOf(this, BaseError.prototype);
        Error.captureStackTrace(this, this.constructor);

        this.errorCode = errorCode;
        this.cause = cause as Error;
        this.detail = detail;
    }
}
