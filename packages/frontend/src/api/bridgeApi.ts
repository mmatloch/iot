import { createHttpClient } from '@clients/httpClient';
import { BridgeRequestType } from '@definitions/bridgeTypes';
import { Configuration } from '@definitions/configurationTypes';

import { ApiRoute } from '../constants';

type PermitDevicesJoinPayload = {
    requestType: BridgeRequestType.PermitJoin;
    value: boolean;
    time?: number;
};

export type RequestBridgePayload = PermitDevicesJoinPayload;
export type BridgeResponse = {};

export const requestBridge = async (configuration: Configuration, payload: RequestBridgePayload) => {
    const requestOptions = {
        url: `${ApiRoute.Configurations.Root}/${configuration._id}/bridge`,
        method: 'PUT',
        body: payload,
    };

    const { body } = await createHttpClient().request<BridgeResponse>(requestOptions);
    return body;
};
