import { Device } from '../../entities/deviceEntity';

type DefaultRequestBridgeFn = (data: unknown) => Promise<void>;

export interface GenericDataPublisher<TRequestBridgeFn = DefaultRequestBridgeFn> {
    publishToDevice: (device: Device, data: Record<string, unknown>) => Promise<void>;
    requestBridge?: TRequestBridgeFn;
}
