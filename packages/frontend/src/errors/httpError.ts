export interface HttpErrorOptions {
    statusCode: number;
    message: string;

    errorCode?: string;
}

export class HttpError extends Error {
    public statusCode: number;
    public errorCode?: string;

    constructor({ message, statusCode, errorCode }: HttpErrorOptions) {
        super(message);

        Object.setPrototypeOf(this, HttpError.prototype);

        this.errorCode = errorCode;
        this.statusCode = statusCode;
    }
}
