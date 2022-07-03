import { Static, Type } from '@sinclair/typebox';
import { Column, Entity, Index } from 'typeorm';

import { mergeSchemas } from '../utils/schemaUtils';
import { GenericEntity, genericEntitySchema } from './genericEntity';

enum EventTriggerType {
    IncomingDeviceData = 'INCOMING_DEVICE_DATA',
    OutgoingDeviceData = 'OUTGOING_DEVICE_DATA',
}

@Entity({ name: 'events' })
export class Event extends GenericEntity {
    constructor() {
        super(eventSchema);
    }

    @Column('text')
    @Index({ unique: true })
    name!: string;

    @Column('text')
    triggerType!: EventTriggerType;

    @Column({
        type: 'jsonb',
        default: '{}',
    })
    triggerFilters!: Record<string, unknown>;

    @Column('text')
    conditionDefinition!: string;

    @Column('text')
    actionDefinition!: string;
}

export const eventDtoSchema = Type.Object({
    name: Type.String(),
    triggerType: Type.Enum(EventTriggerType),
    triggerFilters: Type.Record(Type.String(), Type.Unknown()),
    conditionDefinition: Type.String(),
    actionDefinition: Type.String(),
});

export const eventSchema = mergeSchemas(eventDtoSchema, genericEntitySchema);

export type EventDto = Static<typeof eventDtoSchema>;
