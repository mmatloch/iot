import { faker } from '@faker-js/faker';
import async from 'async';
import { StatusCodes } from 'http-status-codes';
import JWT from 'jsonwebtoken';
import _ from 'lodash';
import Qs from 'qs';

import { getConfig } from '../config.mjs';
import { TEST_USER_EMAIL } from '../constants.mjs';
import { createHttpRequestAssertions } from '../utils/httpAssertions.mjs';
import { createHttpClient } from '../utils/httpClient.mjs';

const RETRY_OPTIONS = {
    times: 10,
    interval: 200,
};

const serializeQuery = (query) => {
    return Qs.stringify(query, {
        indices: false,
        arrayFormat: 'brackets',
    });
};

export const createHttpHelpers = (defaultResourceConfig, resourceConfigOverrides = {}) => {
    const config = getConfig();

    const resourceConfig = {
        ...defaultResourceConfig,
        ...resourceConfigOverrides,
    };

    const httpClient = createHttpClient();

    const authorizeHttpClient = (overrides) => {
        const testUser = {
            _id: faker.datatype.number({ min: 100_000_000 }),
            email: TEST_USER_EMAIL,
            role: 'ADMIN',
            ...overrides,
        };

        const token = JWT.sign(testUser, config.authorization.jwtSecret, {
            algorithm: 'HS256',
            expiresIn: '14d',
            subject: String(testUser._id),
        });

        httpClient.useAuthorizationStrategy({
            name: 'Test JWT token',
            getAuthorizationHeader: () => `JWT ${token}`,
        });
    };

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

    const getById = (id, requestOptions) => {
        const url = new URL(`${resourceConfig.path}/${id}`, resourceConfig.baseUrl);

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

    const repeatSearch = (query, requestOptions) => {
        const makeRetryable = (fn) => async.retryable(RETRY_OPTIONS, fn);

        return _.mapValues(search(query, requestOptions), makeRetryable);
    };

    const patchByLocation = (location, payload, requestOptions) => {
        const url = new URL(location);

        const requestOptionsWithBody = {
            ...requestOptions,
            url,
            body: payload,
            method: 'PATCH',
        };

        const sendRequest = () => httpClient.request(requestOptionsWithBody);

        return createHttpRequestAssertions(sendRequest, requestOptionsWithBody, {
            successStatusCode: StatusCodes.OK,
        });
    };

    const patchById = (id, payload, requestOptions) => {
        const url = new URL(`${resourceConfig.path}/${id}`, resourceConfig.baseUrl);

        return patchByLocation(url, payload, requestOptions);
    };

    return {
        authorizeHttpClient,

        postByLocation,
        post,
        getByLocation,
        get,
        getById,
        searchByLocation,
        search,
        repeatSearch,
        patchByLocation,
        patchById,
    };
};
