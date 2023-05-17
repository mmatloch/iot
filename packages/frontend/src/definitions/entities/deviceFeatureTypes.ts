export enum DeviceFeatureType {
    Numeric = 'NUMERIC',
    Binary = 'BINARY',
    Text = 'TEXT',
    Enum = 'ENUM',
}

export interface DeviceFeature {
    unit: string | null;
    type: DeviceFeatureType;
    propertyName: string;
    description: string;
}
