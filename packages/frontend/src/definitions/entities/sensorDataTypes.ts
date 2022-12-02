import type { GenericEntity } from '@definitions/commonTypes';

export interface SensorData extends GenericEntity {
    deviceId: number;
    data: Record<string, unknown>;
}
