import { Type } from '@sinclair/typebox';

export enum DeviceFeatureUnit {
    Mired = 'mired',
    Percent = '%',
    Celsius = '°C',
    Seconds = 's',
    Milliseconds = 'ms',
    Minutes = 'min',
    Hertz = 'Hz',
    Degrees = '°',
    Millivolts = 'mV',
    PartsPerMillion = 'ppm',
    Amperes = 'A',
    KilowattHours = 'kWh',
    MilligramsPerCubicMeter = 'mg/m³',
    Lux = 'lx',
    LinkQualityIndicator = 'lqi',
    Watts = 'W',
    MicrogramsPerCubicMeter = 'µg/m³',
    VoltAmperes = 'VA',
    Hectopascals = 'hPa',
    Volts = 'V',
    Liters = 'L',
    Decibels = 'dB',
    PartsPerBillion = 'ppb',
}

export enum DeviceFeatureType {
    Numeric = 'NUMERIC',
    Binary = 'BINARY',
    Text = 'TEXT',
    Enum = 'ENUM',
}

export interface DeviceFeature {
    unit: DeviceFeatureUnit | null;
    type: DeviceFeatureType;
    propertyName: string;
    description: string;
}

export const deviceFeatureSchema = Type.Object({
    unit: Type.Union([Type.Enum(DeviceFeatureUnit), Type.Null()]),
    type: Type.Enum(DeviceFeatureType),
    propertyName: Type.String(),
    description: Type.String(),
});
