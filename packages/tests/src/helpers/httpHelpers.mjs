import { StatusCodes } from 'http-status-codes';
import Qs from 'qs';

import { createHttpRequestAssertions } from '../utils/httpAssertions.mjs';

const serializeQuery = (query) => {
    return Qs.stringify(query, {
        indices: false,
        arrayFormat: 'brackets',
    });
};

export const createHttpHelpers = (httpClient, { resourceConfig }) => {
    const postByLocation = (location, payload, requestOptions) => {
        const url = new URL(location);

        const requestOptionsWithBody = {
            ...requestOptions,
            url,
            body: payload,
            method: 'POST',
        };

        const sendRequest = () => httpClient.request(requestOptionsWithBody);

        return createHttpRequestAssertions(sendRequest, requestOptionsWithBody, {
            successStatusCode: StatusCodes.CREATED,
        });
    };

    const post = (payload, requestOptions) => {
        const url = new URL(resourceConfig.path, resourceConfig.baseUrl);

        return postByLocation(url, payload, requestOptions);
    };

    const getByLocation = (location, requestOptions) => {
        const url = new URL(location);

        const extendedRequestOptions = {
            ...requestOptions,
            url,
            method: 'GET',
        };

        const sendRequest = () => httpClient.request(extendedRequestOptions);

        return createHttpRequestAssertions(sendRequest, extendedRequestOptions, {
            successStatusCode: StatusCodes.OK,
        });
    };

    const get = (requestOptions) => {
        const url = new URL(resourceConfig.path, resourceConfig.baseUrl);

        return getByLocation(url, requestOptions);
    };

    const search = (query, requestOptions) => {
        const url = new URL(resourceConfig.path, resourceConfig.baseUrl);

        return searchByLocation(url, query, requestOptions);
    };

    const searchByLocation = (location, query, requestOptions) => {
        const serializedQuery = serializeQuery(query);
        const stringifiedQuery = JSON.stringify(query, null, 2);

        const url = new URL(`${location}?${serializedQuery}`);

        return {
            expectHits: async (expectedHitsCount) => {
                const response = await getByLocation(url, requestOptions).expectSuccess();

                expect(response.body).toHaveProperty('_hits');

                const found = response.body._hits.length;
                const assertionMessage = `Expected to find ${expectedHitsCount} documents, found ${found} \n\n  URL: ${url} \n\n  Query: ${stringifiedQuery}`;
                expect(found, assertionMessage).toBe(expectedHitsCount);

                return response;
            },
            ...getByLocation(url, requestOptions),
        };
    };

    return {
        postByLocation,
        post,
        getByLocation,
        get,
        searchByLocation,
        search,
    };
};
