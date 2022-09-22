import { Device } from '@definitions/entities/deviceTypes';
import { Event } from '@definitions/entities/eventTypes';
import { SensorData } from '@definitions/entities/sensorDataTypes';

interface DevicesSdk {
    findByIdOrFail: (id: number) => Promise<Device>;
    createSensorData: (device: Device, data: SensorData['data']) => Promise<void>;
    publishData: (device: Device, data: Record<string, unknown>) => Promise<void>;
}

interface EventsSdk {
    findByIdOrFail: (id: number) => Promise<Event>;
}

export interface Sdk {
    devices: DevicesSdk;
    events: EventsSdk;
}
