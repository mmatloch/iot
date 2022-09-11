import { Static, Type } from '@sinclair/typebox';
import { Column, Entity } from 'typeorm';

import { mergeSchemas } from '../utils/schemaUtils';
import { GenericEntity, genericEntitySchema } from './genericEntity';

export enum ConfigurationState {
    Active = 'ACTIVE',
    Inactive = 'INACTIVE',
}

export enum ConfigurationType {
    ZigbeeBridge = 'ZIGBEE_BRIDGE',
}

@Entity({ name: 'configurations' })
export class Configuration extends GenericEntity {
    constructor() {
        super(configurationSchema);
    }

    @Column('text')
    state!: ConfigurationState;

    @Column('jsonb')
    data!: ZigbeeBridgeConfiguration;
}

const zigbeeBridgeConfigurationSchema = Type.Object(
    {
        type: Type.Literal(ConfigurationType.ZigbeeBridge),

        topicPrefix: Type.String(),
        permitDevicesJoin: Type.Boolean(),
        permitDevicesJoinStartAt: Type.Optional(Type.String()),
        permitDevicesJoinEndAt: Type.Optional(Type.String()),
    },
    {
        additionalProperties: false,
    },
);

export type ZigbeeBridgeConfiguration = Static<typeof zigbeeBridgeConfigurationSchema>;

export const configurationDtoSchema = Type.Object(
    {
        state: Type.Enum(ConfigurationState),
        data: Type.Union([zigbeeBridgeConfigurationSchema]),
    },
    {
        additionalProperties: false,
    },
);

export type ConfigurationDto = Static<typeof configurationDtoSchema>;

export const configurationSchema = mergeSchemas(configurationDtoSchema, genericEntitySchema);
export const configurationUpdateSchema = Type.Partial(configurationSchema);
