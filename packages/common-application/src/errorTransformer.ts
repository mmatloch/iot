import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';

export interface TransformedErrorBody {
    message: string;
    errorCode?: string;
    detail?: string;
    validationDetails?: Record<string, unknown>;
    stack?: string;
    cause?: TransformedErrorBody;
}

export interface TransformedError {
    statusCode: number;
    headers: Record<string, unknown>;
    body: TransformedErrorBody & { statusCode: number };
}

const getErrorCode = (error: Error): string | undefined => {
    const possibleProperties = ['errorCode', 'code'];

    for (const property of possibleProperties) {
        if (_.has(error, property)) {
            return _.get(error, property);
        }
    }
};

const getStatusCode = (error: Error): number => {
    if (_.has(error, 'statusCode')) {
        return Number(_.get(error, 'statusCode'));
    }

    return StatusCodes.INTERNAL_SERVER_ERROR;
};

const getDetail = (error: Error): string | undefined => {
    if (_.has(error, 'detail')) {
        return _.get(error, 'detail');
    }
};

const getValidationDetails = (error: Error): Record<string, unknown> | undefined => {
    if (_.has(error, 'validationDetails')) {
        return _.get(error, 'validationDetails');
    }
};

export const transformErrorBody = (error: Error): TransformedErrorBody => {
    return {
        errorCode: getErrorCode(error),
        message: error.message,
        detail: getDetail(error),
        validationDetails: getValidationDetails(error),
        stack: error.stack,
        cause: error.cause ? transformErrorBody(error.cause) : undefined,
    };
};

export const transformError = (error: Error): TransformedError => {
    const statusCode = getStatusCode(error);

    const headers: Record<string, unknown> = {
        'content-type': 'application/json',
    };

    const body = {
        statusCode: statusCode,
        ...transformErrorBody(error),
    };

    return {
        statusCode,
        headers,
        body,
    };
};
