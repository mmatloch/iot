import { Device } from '../../entities/deviceEntity';

export interface GenericDataPublisher {
    publish: (device: Device, data: Record<string, unknown>) => Promise<void>;
}
