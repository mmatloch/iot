import { BridgeRequestType } from '@definitions/bridgeTypes';
import { Configuration } from '@definitions/entities/configurationTypes';
import { useGenericMutation } from '@hooks/useGenericMutation';

import { ApiRoute } from '../constants';

type PermitDevicesJoinPayload = {
    requestType: BridgeRequestType.PermitJoin;
    value: boolean;
    time?: number;
};

export type RequestBridgePayload = PermitDevicesJoinPayload;
export type BridgeResponse = {};

export const useRequestBridge = (configuration: Configuration) => {
    return useGenericMutation<BridgeResponse, RequestBridgePayload>({
        url: `${ApiRoute.Configurations.Root}/${configuration._id}/bridge`,
        method: 'PUT',
    });
};
