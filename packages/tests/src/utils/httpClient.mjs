import _ from 'lodash';
import MimeType from 'whatwg-mimetype';

export const createHttpClient = () => {
    let authorizationStrategy = {
        name: 'None',
        getAuthorizationHeader: () => undefined,
    };

    const useAuthorizationStrategy = (strategy) => {
        authorizationStrategy = strategy;
    };

    const serializeResponseHeaders = (headers) => {
        return Object.fromEntries(headers.entries());
    };

    const parseResponseBody = (response, serializedHeaders) => {
        const contentMimeType = MimeType.parse(serializedHeaders['content-type']);

        if (contentMimeType && contentMimeType.essence === 'application/json') {
            return response.json();
        }

        return response.text();
    };

    const serializeRequestBodyAndHeaders = (body, headers) => {
        const defaultHeaders = {
            ...headers,
        };

        const authorizationHeader = authorizationStrategy.getAuthorizationHeader();
        if (authorizationHeader) {
            defaultHeaders.authorization = authorizationHeader;
        }

        if (!body) {
            return {
                body: undefined,
                headers: defaultHeaders,
            };
        }

        if (_.isString(body)) {
            return {
                body,
                headers: {
                    ...defaultHeaders,
                    'content-type': 'text/plain',
                },
            };
        }

        try {
            return {
                body: JSON.stringify(body),
                headers: {
                    ...defaultHeaders,
                    'content-type': 'application/json',
                },
            };
        } catch (e) {
            throw new Error('Failed to serialize the request body', { cause: e });
        }
    };

    const serializeRequestOptions = (requestOptions) => {
        const { body, headers } = serializeRequestBodyAndHeaders(requestOptions.body, requestOptions.headers);

        return {
            ...requestOptions,
            body,
            headers,
        };
    };

    const request = async (opts) => {
        const requestOptions = serializeRequestOptions(opts);

        const response = await fetch(requestOptions.url, _.omit(requestOptions, ['url']));

        const responseHeaders = serializeResponseHeaders(response.headers);

        return {
            statusCode: response.status,
            headers: responseHeaders,
            body: await parseResponseBody(response, responseHeaders),
            request: requestOptions,
            authorizationStrategy,
        };
    };

    return {
        request,
        useAuthorizationStrategy,
    };
};
