export interface BaseErrorOptions {
    errorCode: string;
    message?: string;
    cause?: unknown;
}

export class BaseError extends Error {
    public errorCode;
    public cause;

    constructor({ errorCode, message, cause }: BaseErrorOptions) {
        super(message);
        Object.setPrototypeOf(this, BaseError.prototype);
        Error.captureStackTrace(this, this.constructor);

        this.errorCode = errorCode;
        this.cause = cause as Error;
    }
}
