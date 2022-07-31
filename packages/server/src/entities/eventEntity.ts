import { Static, Type } from '@sinclair/typebox';
import { Column, Entity, Index } from 'typeorm';

import { EventTriggerType } from '../constants';
import { EventTriggerContext } from '../events/eventRunDefinitions';
import { eventTrigger } from '../events/eventTrigger';
import { mergeSchemas } from '../utils/schemaUtils';
import { GenericEntity, genericEntitySchema } from './genericEntity';

@Entity({ name: 'events' })
export class Event extends GenericEntity {
    constructor() {
        super(eventSchema);
    }

    @Column('text')
    @Index({ unique: true })
    displayName!: string;

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

    trigger = async (context: EventTriggerContext = {}): Promise<void> => {
        await eventTrigger(this, context);
    };
}

export const eventDtoSchema = Type.Object({
    displayName: Type.String(),
    triggerType: Type.Enum(EventTriggerType),
    triggerFilters: Type.Record(Type.String(), Type.Unknown()),
    conditionDefinition: Type.String(),
    actionDefinition: Type.String(),
});

export const eventSchema = mergeSchemas(eventDtoSchema, genericEntitySchema);

export type EventDto = Static<typeof eventDtoSchema>;
