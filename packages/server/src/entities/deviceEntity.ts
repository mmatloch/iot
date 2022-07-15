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
    /**
     * The device is configured and running fine
     */
    Active = 'ACTIVE',
    /**
     * The device was turned off by the user or the bridge. No data is received or sent to it
     */
    Inactive = 'INACTIVE',
    /**
     * The device has been successfully interviewed but not configured by the user.
     * It has a default `displayName`, etc.
     */
    Unconfigured = 'UNCONFIGURED',
    /**
     * The device is being interviewed by an external bridge
     */
    Interviewing = 'INTERVIEWING',
    /**
     * An error occurred while adding, interviewing, or configuring the device.
     *
     * Not used at this point.
     */
    Error = 'ERROR',
    /**
     * The newly added device. This state has a device that hasn't been interviewed yet
     */
    New = 'NEW',
}

export enum DeviceDeactivatedByType {
    Bridge = 'BRIDGE',
    User = 'USER',
}

type DeviceDeactivatedBy =
    | {
          type: DeviceDeactivatedByType.Bridge;
          name: string;
      }
    | {
          type: DeviceDeactivatedByType.User;
          id: number;
      };

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

    @Column({
        type: 'text',
        unique: true,
    })
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

    @Column({
        type: 'jsonb',
        default: null,
        nullable: true,
    })
    deactivatedBy?: DeviceDeactivatedBy;
}

const deactivatedByBridgeSchema = Type.Object({
    type: Type.Literal(DeviceDeactivatedByType.Bridge),
    name: Type.String(),
});

const deactivatedByUserSchema = Type.Object({
    type: Type.Literal(DeviceDeactivatedByType.User),
    id: Type.Integer(),
});

const deactivatedBySchema = Type.Union([deactivatedByBridgeSchema, deactivatedByUserSchema]);

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
        deactivatedBy: Type.Optional(deactivatedBySchema),
    },
    {
        additionalProperties: false,
    },
);

export const deviceSchema = mergeSchemas(deviceDtoSchema, genericEntitySchema);

export type DeviceDto = Static<typeof deviceDtoSchema>;
