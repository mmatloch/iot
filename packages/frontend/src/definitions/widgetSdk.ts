import type { Device } from '@definitions/entities/deviceTypes';
import type { Event } from '@definitions/entities/eventTypes';

interface DevicesSdk {
    findByIdOrFail: (id: number) => Promise<Device>;
}

interface EventsSdk {
    findByIdOrFail: (id: number) => Promise<Event>;
}

export interface Sdk {
    devices: DevicesSdk;
    events: EventsSdk;
}
