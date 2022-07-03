import chalk from 'chalk';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';

const stringifyResponse = (response) => {
    const responseClone = _.cloneDeep(response);

    const hitsLen = responseClone.body?._hits?.length;

    if (hitsLen > 1) {
        responseClone.body._hits = [responseClone.body._hits[0], `[${hitsLen - 1} documents more...]`];
    }

    return JSON.stringify(responseClone, null, 2);
};

const assertResponseStatusCode = (request, response, expectedStatusCode) => {
    const assertionMessage = () =>
        `Unexpected status code ${chalk.red(response.statusCode)} from ${chalk.white.bold(
            request.method,
        )} ${chalk.white.bold(request.url)}, expected ${chalk.green(
            expectedStatusCode,
        )} \n\n  Response: ${stringifyResponse(response)}`;

    expect(response.statusCode, assertionMessage).toBe(expectedStatusCode);
};

const assertResponseBodyError = (request, response, expectedError) => {
    const assertionMessageFactory = (key, value, expectedValue) => () =>
        `Unexpected ${chalk.cyan(key)} with value ${chalk.red(value)} in response body from ${chalk.white.bold(
            request.method,
        )} ${chalk.white.bold(request.url)}, expected ${chalk.green(expectedValue)} \n\n  Response: ${stringifyResponse(
            response,
        )}`;

    // check for HTTP Status Code
    if (expectedError['statusCode']) {
        assertResponseStatusCode(request, response, expectedError['statusCode']);
    }

    Object.entries(expectedError).forEach(([key, expectedValue]) => {
        const responseValue = response.body[key];

        expect(responseValue, assertionMessageFactory(key, responseValue, expectedValue)).toEqual(expectedValue);
    });
};

export const createHttpRequestAssertions = (sendRequest, request, { successStatusCode }) => {
    const genericErrorAssertion = async (expectedError) => {
        const response = await sendRequest();

        if (expectedError) {
            assertResponseBodyError(request, response, expectedError);
        }

        return response;
    };

    const genericStatusCodeAssertion = async (statusCode) => {
        const response = await sendRequest();

        assertResponseStatusCode(request, response, statusCode);

        return response;
    };

    return {
        send: () => sendRequest(),
        expectSuccess: (expectedStatusCode = successStatusCode) => genericStatusCodeAssertion(expectedStatusCode),

        expectNotFound: (expectedError) =>
            genericErrorAssertion({ ...expectedError, statusCode: StatusCodes.NOT_FOUND }),

        expectUnauthorized: (expectedError) =>
            genericErrorAssertion({ ...expectedError, statusCode: StatusCodes.UNAUTHORIZED }),

        expectForbidden: (expectedError) =>
            genericErrorAssertion({ ...expectedError, statusCode: StatusCodes.FORBIDDEN }),

        expectConflict: (expectedError) =>
            genericErrorAssertion({ ...expectedError, statusCode: StatusCodes.CONFLICT }),

        expectUnprocessableEntity: (expectedError) =>
            genericErrorAssertion({ ...expectedError, statusCode: StatusCodes.UNPROCESSABLE_ENTITY }),

        expectValidationError: async (validationContext, validationDetails = [], expectedDetailsCount) => {
            const response = await sendRequest();
            assertValidationErrorResponse(
                request,
                response,
                validationContext,
                validationDetails,
                expectedDetailsCount,
            );
            return response;
        },

        expectInternalServerError: (expectedError) =>
            genericErrorAssertion({ ...expectedError, statusCode: StatusCodes.INTERNAL_SERVER_ERROR }),
    };
};
