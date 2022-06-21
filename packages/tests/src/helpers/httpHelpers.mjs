import { StatusCodes } from 'http-status-codes';

import { createHttpRequestAssertions } from '../utils/httpAssertions.mjs';
import { createHttpClient } from '../utils/httpClient.mjs';

export const createHttpHelpers = ({ resourceConfig }) => {
    const request = createHttpClient();

    const postByLocation = (location, payload, requestOptions) => {
        const url = new URL(location);

        const requestOptionsWithBody = {
            ...requestOptions,
            url,
            body: payload,
            method: 'POST',
        };

        const sendRequest = () => request(requestOptionsWithBody);

        return createHttpRequestAssertions(sendRequest, requestOptionsWithBody, {
            successStatusCode: StatusCodes.CREATED,
        });
    };

    const post = (payload, requestOptions) => {
        const url = new URL(resourceConfig.path, resourceConfig.baseUrl);

        return postByLocation(url, payload, requestOptions);
    };

    return {
        postByLocation,
        post,
    };
};
