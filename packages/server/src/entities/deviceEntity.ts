import { Static, Type } from '@sinclair/typebox';
import { Column, Entity, Index } from 'typeorm';

import { mergeSchemas } from '../utils/schemaUtils';
import { GenericEntity, genericEntitySchema } from './genericEntity';

export enum DeviceType {
    Unknown = 'UNKNOWN',
    Coordinator = 'COORDINATOR',
    EndDevice = 'END_DEVICE',
    Router = 'ROUTER',
    Virtual = 'VIRTUAL',
}

export enum DevicePowerSource {
    Unknown = 'UNKNOWN',
    Battery = 'BATTERY',
    MainsSinglePhase = 'MAINS_SINGLE_PHASE',
    MainsThreePhase = 'MAINS_THREE_PHASE',
    EmergencyMains = 'EMERGENCY_MAINS',
    Dc = 'DC',
    Virtual = 'VIRTUAL',
}

export enum DeviceProtocol {
    Zigbee = 'ZIGBEE',
}

export enum DeviceState {
    Active = 'ACTIVE',
    Inactive = 'INACTIVE',
    Unconfigured = 'UNCONFIGURED',
}

@Entity({ name: 'devices' })
export class Device extends GenericEntity {
    constructor() {
        super(deviceSchema);
    }

    @Index({ unique: true })
    @Column('text')
    displayName!: string;

    @Column('text')
    model!: string;

    @Column('text')
    vendor!: string;

    @Column('text')
    description!: string;

    @Column('text')
    ieeeAddress!: string;

    @Column('text')
    powerSource!: DevicePowerSource;

    @Column('text')
    type!: DeviceType;

    @Column('text')
    protocol!: DeviceProtocol;

    @Column('text')
    state!: DeviceState;

    @Column({
        type: 'jsonb',
        default: '{}',
    })
    sensorData!: Record<string, unknown>;
}

export const deviceDtoSchema = Type.Object(
    {
        displayName: Type.String(),
        model: Type.String(),
        vendor: Type.String(),
        description: Type.String(),
        ieeeAddress: Type.String(),
        powerSource: Type.Enum(DevicePowerSource),
        type: Type.Enum(DeviceType),
        protocol: Type.Enum(DeviceProtocol),
        state: Type.Enum(DeviceState),
        sensorData: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
    },
    {
        additionalProperties: false,
    },
);

export const deviceSchema = mergeSchemas(deviceDtoSchema, genericEntitySchema);

export type DeviceDto = Static<typeof deviceDtoSchema>;
