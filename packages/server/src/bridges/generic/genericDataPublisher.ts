import { Device } from '../../entities/deviceEntity';

export interface GenericDataPublisher {
    publishToDevice: (device: Device, data: Record<string, unknown>) => Promise<void>;
}
