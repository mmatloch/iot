import type { Static } from '@sinclair/typebox';
import { Type } from '@sinclair/typebox';
import { Column, Entity, Index } from 'typeorm';

import {
    DeviceDeactivatedBy,
    DeviceDeactivatedByType,
    DeviceFeatureState,
    DevicePowerSource,
    DeviceProtocol,
    DeviceState,
    DeviceType,
} from '../definitions/deviceDefinitions';
import { mergeSchemas } from '../utils/schemaUtils';
import { DeviceFeatures, deviceFeatureEntrySchema } from './deviceFeatureEntity';
import { GenericEntity, genericEntitySchema } from './generic/genericEntity';

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
    manufacturer!: string;

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
        default: null,
        nullable: true,
    })
    deactivatedBy!: DeviceDeactivatedBy | null;

    @Column('jsonb')
    features!: DeviceFeatures;

    @Column('jsonb')
    featureState!: DeviceFeatureState;
}

const deactivatedByBridgeSchema = Type.Object({
    type: Type.Literal(DeviceDeactivatedByType.Bridge),
    name: Type.String(),
});

const deactivatedByUserSchema = Type.Object({
    type: Type.Literal(DeviceDeactivatedByType.User),
    userId: Type.Integer(),
    _user: Type.Optional(Type.Any()),
});

const deactivatedBySchema = Type.Union([deactivatedByBridgeSchema, deactivatedByUserSchema]);

const featureStateEntrySchema = Type.Object({
    value: Type.Any(),
    updatedAt: Type.String(),
});

export const deviceDtoSchema = Type.Object(
    {
        displayName: Type.String(),
        model: Type.String(),
        vendor: Type.String(),
        manufacturer: Type.String(),
        description: Type.String(),
        ieeeAddress: Type.String(),
        powerSource: Type.Enum(DevicePowerSource),
        type: Type.Enum(DeviceType),
        protocol: Type.Enum(DeviceProtocol),
        state: Type.Enum(DeviceState),
        deactivatedBy: Type.Optional(Type.Union([deactivatedBySchema, Type.Null()])),
        features: Type.Record(Type.String(), deviceFeatureEntrySchema),
        featureState: Type.Record(Type.String(), featureStateEntrySchema),
    },
    {
        additionalProperties: false,
    },
);

export const deviceSchema = mergeSchemas(deviceDtoSchema, genericEntitySchema);

export type DeviceDto = Static<typeof deviceDtoSchema>;

export const deviceSearchQuerySchema = Type.Partial(Type.Omit(deviceDtoSchema, ['deactivatedBy']));
export type DeviceSearchQuery = Static<typeof deviceSearchQuerySchema>;
