import { createDevicesSdk } from './devicesSdk';
import { createEventsSdk } from './eventsSdk';

export type EventRunSdk = Record<string, unknown>;

export const createEventRunSdk = (): EventRunSdk => {
    return {
        devices: createDevicesSdk(),
        events: createEventsSdk(),
    };
};
