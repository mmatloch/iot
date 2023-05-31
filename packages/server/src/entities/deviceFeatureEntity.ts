import { Static, Type } from '@sinclair/typebox';

import { mergeSchemas } from '../utils/schemaUtils';

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
    DecibelMilliwatts = 'dBm',
    PartsPerBillion = 'ppb',
}

export enum DeviceFeatureType {
    Numeric = 'NUMERIC',
    Binary = 'BINARY',
    Text = 'TEXT',
    Enum = 'ENUM',
}

const genericDeviceFeatureSchema = Type.Object({
    unit: Type.Union([Type.Enum(DeviceFeatureUnit), Type.Null()]),
    description: Type.String(),
});

export type GenericDeviceFeature = Static<typeof genericDeviceFeatureSchema>;

const binaryDeviceFeatureSchema = mergeSchemas(
    Type.Object({
        type: Type.Literal(DeviceFeatureType.Binary),

        valueOn: Type.Unknown(),
        valueOff: Type.Unknown(),
        valueToggle: Type.Optional(Type.Unknown()),
    }),
    genericDeviceFeatureSchema,
);

export type BinaryDeviceFeature = Static<typeof binaryDeviceFeatureSchema>;

const numericDeviceFeatureSchema = mergeSchemas(
    Type.Object({
        type: Type.Literal(DeviceFeatureType.Numeric),

        valueMin: Type.Optional(Type.Number()),
        valueMax: Type.Optional(Type.Number()),
        valueStep: Type.Optional(Type.Number()),
    }),
    genericDeviceFeatureSchema,
);

export type NumericDeviceFeature = Static<typeof numericDeviceFeatureSchema>;

const enumDeviceFeatureSchema = mergeSchemas(
    Type.Object({
        type: Type.Literal(DeviceFeatureType.Enum),

        values: Type.Optional(Type.Array(Type.Unknown())),
    }),
    genericDeviceFeatureSchema,
);

export type EnumDeviceFeature = Static<typeof enumDeviceFeatureSchema>;

const textDeviceFeatureSchema = mergeSchemas(
    Type.Object({
        type: Type.Literal(DeviceFeatureType.Text),
    }),
    genericDeviceFeatureSchema,
);

export type TextDeviceFeature = Static<typeof textDeviceFeatureSchema>;

export const deviceFeatureEntrySchema = Type.Union([
    binaryDeviceFeatureSchema,
    numericDeviceFeatureSchema,
    enumDeviceFeatureSchema,
    textDeviceFeatureSchema,
]);

export type DeviceFeatureEntry = Static<typeof deviceFeatureEntrySchema>;
export type DeviceFeatures = Record<string, DeviceFeatureEntry>;
