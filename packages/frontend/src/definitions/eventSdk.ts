import type { Device } from '@definitions/entities/deviceTypes';
import type { Event } from '@definitions/entities/eventTypes';
import type { SensorData } from '@definitions/entities/sensorDataTypes';

import type { EventTriggerContext, EventTriggerOptions } from './eventTriggerTypes';

interface EventWithTrigger extends Event {
    trigger: (context?: EventTriggerContext, opts?: EventTriggerOptions) => Promise<void>;
}

interface DevicesSdk {
    findByIdOrFail: (id: number) => Promise<Device>;
    createSensorData: (device: Device, data: SensorData['data']) => Promise<void>;
    publishData: (device: Device, data: Record<string, unknown>) => Promise<void>;
}

interface EventsSdk {
    findByIdOrFail: (id: number) => Promise<EventWithTrigger>;
}

export interface Sdk {
    devices: DevicesSdk;
    events: EventsSdk;
}
