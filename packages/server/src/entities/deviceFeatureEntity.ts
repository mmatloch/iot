import type { Static } from '@sinclair/typebox';
import { Type } from '@sinclair/typebox';
import { Column, Entity, Index } from 'typeorm';

import { mergeSchemas } from '../utils/schemaUtils';
import { GenericEntity, genericEntitySchema } from './generic/genericEntity';

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

interface DeviceFeatureValue {
    valueMax: number;
    valueMin: number;
    valueStep: number;
    valueOff: string;
    valueOn: string;
    valueToggle: string;
    valueList: string[];
}

const deviceFeatureValueSchema = Type.Object({
    valueMax: Type.Number(),
    valueMin: Type.Number(),
    valueStep: Type.Number(),
    valueOff: Type.String(),
    valueOn: Type.String(),
    valueToggle: Type.String(),
    valueList: Type.Array(Type.String()),
});

@Entity({ name: 'devicefeatures' })
export class DeviceFeature extends GenericEntity {
    constructor() {
        super(deviceFeatureSchema);
    }

    @Index({ unique: true })
    @Column('text')
    displayName!: string;

    @Column({
        type: 'text',
        default: null,
        nullable: true,
    })
    unit!: DeviceFeatureUnit | null;

    @Column('text')
    type!: DeviceFeatureType;

    @Column({
        type: 'jsonb',
        default: null,
        nullable: true,
    })
    value!: DeviceFeatureValue | null;
}

export const deviceFeatureDtoSchema = Type.Object(
    {
        displayName: Type.String(),
        type: Type.Enum(DeviceFeatureType),
        unit: Type.Union([Type.Enum(DeviceFeatureUnit), Type.Null()]),
        value: Type.Union([deviceFeatureValueSchema, Type.Null()]),
    },
    {
        additionalProperties: false,
    },
);

export const deviceFeatureSchema = mergeSchemas(deviceFeatureDtoSchema, genericEntitySchema);

export type DeviceFeatureDto = Static<typeof deviceFeatureDtoSchema>;

export const deviceFeatureSearchQuerySchema = Type.Partial(deviceFeatureDtoSchema);
export type DeviceFeatureSearchQuery = Static<typeof deviceFeatureSearchQuerySchema>;
