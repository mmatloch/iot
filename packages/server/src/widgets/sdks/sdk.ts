import { createDevicesSdk } from './devicesSdk';
import { createEventsSdk } from './eventsSdk';

export type WidgetsSdk = Record<string, unknown>;

export const createWidgetsSdk = (): WidgetsSdk => {
    return {
        devices: createDevicesSdk(),
        events: createEventsSdk(),
    };
};
