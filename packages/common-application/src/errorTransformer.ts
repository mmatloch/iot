import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';

interface TransformedError {
    statusCode: number;
    headers: Record<string, unknown>;
    body: string;
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

const getDetails = (error: Error): string | undefined => {
    if (_.has(error, 'details')) {
        return _.get(error, 'details');
    }
};

const buildErrorBody = (error: Error): Record<string, unknown> => {
    return {
        errorCode: getErrorCode(error),
        message: error.message,
        details: getDetails(error),
        stack: error.stack,
        cause: error.cause ? buildErrorBody(error.cause) : undefined,
    };
};

export const transformError = (error: Error): TransformedError => {
    const statusCode = getStatusCode(error);

    const headers: Record<string, unknown> = {
        'content-type': 'application/json',
    };

    const body = {
        statusCode: statusCode,
        ...buildErrorBody(error),
    };

    return {
        statusCode,
        headers,
        body: JSON.stringify(body),
    };
};
