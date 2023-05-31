export enum DeviceFeatureType {
    Numeric = 'NUMERIC',
    Binary = 'BINARY',
    Text = 'TEXT',
    Enum = 'ENUM',
}

interface GenericDeviceFeature {
    unit: string | null;
    description: string;
}

export interface TextDeviceFeature extends GenericDeviceFeature {
    type: DeviceFeatureType.Text;
}

export interface NumericDeviceFeature extends GenericDeviceFeature {
    type: DeviceFeatureType.Numeric;

    valueMin?: number;
    valueMax?: number;
    valueStep?: number;
}

export interface EnumDeviceFeature extends GenericDeviceFeature {
    type: DeviceFeatureType.Enum;

    values?: unknown[];
}

export interface BinaryDeviceFeature extends GenericDeviceFeature {
    type: DeviceFeatureType.Binary;

    valueOn: unknown;
    valueOff: unknown;
    valueToggle?: unknown;
}

export type DeviceFeatureEntry = BinaryDeviceFeature | EnumDeviceFeature | NumericDeviceFeature | TextDeviceFeature;
