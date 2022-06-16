export interface BaseErrorOptions {
    errorCode: string;
    message?: string;
}

export class BaseError extends Error {
    public errorCode;

    constructor({ errorCode, message }: BaseErrorOptions) {
        super(message);
        Object.setPrototypeOf(this, BaseError.prototype);
        Error.captureStackTrace(this, this.constructor);

        this.errorCode = errorCode;
    }
}
