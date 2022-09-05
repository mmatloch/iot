import MimeType from 'whatwg-mimetype';

import { HttpError } from '../errors/httpError';

const getAuthorizationHeader = () => {
    const token = window.localStorage.getItem('accessToken');

    if (token) {
        return `JWT ${token}`;
    }

    return;
};

export interface RequestOptions {
    method: string;
    url: string;
    body?: Record<string, unknown>;
    headers?: Record<string, string>;
}

interface SerializedRequestBodyAndHeaders {
    body: string | undefined;
    headers: Headers;
}

interface SerializedRequestOptions
    extends Omit<RequestOptions, 'url' | 'body' | 'headers'>,
        SerializedRequestBodyAndHeaders {}

type SerializedResponseHeaders = Record<string, string>;

interface SerializedResponse<TResponseBody> {
    statusCode: number;
    body: TResponseBody;
    headers: SerializedResponseHeaders;
}

export const createHttpClient = () => {
    const serializeResponseHeaders = (headers: Headers): SerializedResponseHeaders => {
        return Object.fromEntries(headers.entries());
    };

    const parseResponseBody = (response: Response, serializedHeaders: SerializedResponseHeaders) => {
        const contentMimeType = MimeType.parse(serializedHeaders['content-type']);

        if (contentMimeType && contentMimeType.essence === 'application/json') {
            return response.json();
        }

        return response.text();
    };

    const serializeRequestBodyAndHeaders = (
        body: RequestOptions['body'],
        headers: RequestOptions['headers'],
    ): SerializedRequestBodyAndHeaders => {
        const defaultHeaders = new Headers(Object.entries(headers || {}));

        const authorizationHeader = getAuthorizationHeader();
        if (authorizationHeader) {
            defaultHeaders.set('authorization', authorizationHeader);
        }

        if (!body) {
            return {
                body: undefined,
                headers: defaultHeaders,
            };
        }

        if (typeof body === 'string') {
            defaultHeaders.set('content-type', 'text/plain');

            return {
                body,
                headers: defaultHeaders,
            };
        }

        try {
            defaultHeaders.set('content-type', 'application/json');

            return {
                body: JSON.stringify(body),
                headers: defaultHeaders,
            };
        } catch (e) {
            throw new Error('Failed to serialize the request body');
        }
    };

    const serializeRequestOptions = (requestOptions: RequestOptions): SerializedRequestOptions => {
        const { body, headers } = serializeRequestBodyAndHeaders(requestOptions.body, requestOptions.headers);

        return {
            ...requestOptions,
            body,
            headers,
        };
    };

    const request = async <TResponseBody>(opts: RequestOptions): Promise<SerializedResponse<TResponseBody>> => {
        const serializedRequestOptions = serializeRequestOptions(opts);

        const response = await fetch(opts.url, serializedRequestOptions);

        const responseHeaders = serializeResponseHeaders(response.headers);
        const responseBody = await parseResponseBody(response, responseHeaders);

        if (response.status >= 400) {
            throw new HttpError({
                statusCode: response.status,
                message: responseBody?.message || 'Error',
                errorCode: responseBody?.errorCode,
                detail: responseBody?.detail,
            });
        }

        return {
            statusCode: response.status,
            headers: responseHeaders,
            body: responseBody,
        };
    };

    return {
        request,
    };
};
