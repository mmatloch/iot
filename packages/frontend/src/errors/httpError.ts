export interface HttpErrorOptions {
    statusCode: number;
    message: string;

    errorCode?: string;
    detail?: string;
}

export class HttpError extends Error {
    public statusCode: number;
    public errorCode?: string;
    public detail?: string;

    constructor({ message, statusCode, errorCode, detail }: HttpErrorOptions) {
        super(message);

        Object.setPrototypeOf(this, HttpError.prototype);

        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.detail = detail;
    }
}
