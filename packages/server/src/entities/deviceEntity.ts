import { Static, Type } from '@sinclair/typebox';
import { Column, Entity, Index } from 'typeorm';

import { mergeSchemas } from '../utils/schemaUtils';
import { GenericEntity, genericEntitySchema } from './genericEntity';

enum DeviceType {
    Unknown = 'UNKNOWN',
    Coordinator = 'COORDINATOR',
    EndDevice = 'END_DEVICE',
    Router = 'ROUTER',
    Virtual = 'VIRTUAL',
}

enum DevicePowerSource {
    Unknown = 'UNKNOWN',
    Battery = 'BATTERY',
    MainsSinglePhase = 'MAINS_SINGLE_PHASE',
    MainsThreePhase = 'MAINS_THREE_PHASE',
    Dc = 'DC',
    Virtual = 'VIRTUAL',
}

enum DeviceProtocol {
    Zigbee = 'ZIGBEE',
}

enum DeviceState {
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

export const deviceDtoSchema = Type.Object({});

export const deviceSchema = mergeSchemas(deviceDtoSchema, genericEntitySchema);

export type DeviceDto = Static<typeof deviceDtoSchema>;
