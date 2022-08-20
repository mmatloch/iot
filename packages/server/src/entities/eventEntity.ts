import { Static, Type } from '@sinclair/typebox';
import { Column, Entity, Index } from 'typeorm';

import {
    EventMetadataOnMultipleInstances,
    EventMetadataTaskType,
    EventMetadataType,
    EventState,
    EventTriggerType,
} from '../events/eventDefinitions';
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

    @Column({
        type: 'text',
        default: EventState.Active,
    })
    state!: EventState;

    @Column({
        type: 'jsonb',
        nullable: true,
        default: null,
    })
    metadata!: EventSchedulerMetadata | null;

    trigger = async (context: EventTriggerContext = {}): Promise<void> => {
        await eventTrigger(this, context);
    };
}

const eventSchedulerMetadataSchema = Type.Object({
    type: Type.Literal(EventMetadataType.Scheduler),
    retryImmediatelyAfterBoot: Type.Boolean(),
    runAfterEvent: Type.Optional(Type.Integer()),
    recurring: Type.Boolean(),
    cronExpression: Type.String(),
    taskType: Type.Enum(EventMetadataTaskType),
    onMultipleInstances: Type.Enum(EventMetadataOnMultipleInstances),
});

export type EventSchedulerMetadata = Static<typeof eventSchedulerMetadataSchema>;

export const eventDtoSchema = Type.Object({
    displayName: Type.String(),
    triggerType: Type.Enum(EventTriggerType),
    triggerFilters: Type.Record(Type.String(), Type.Unknown()),
    conditionDefinition: Type.String(),
    actionDefinition: Type.String(),
    state: Type.Enum(EventState, {
        default: EventState.Active,
    }),
    metadata: Type.Union([Type.Null(), eventSchedulerMetadataSchema], {
        default: null,
    }),
});

export const eventSchema = mergeSchemas(eventDtoSchema, genericEntitySchema);

export type EventDto = Static<typeof eventDtoSchema>;

export const eventSearchQuerySchema = Type.Partial(Type.Omit(eventDtoSchema, ['metadata']));
delete eventSearchQuerySchema.properties.state.default;

export type EventSearchQuery = Static<typeof eventSearchQuerySchema>;

export const eventUpdateSchema = Type.Partial(eventDtoSchema);
delete eventUpdateSchema.properties.state.default;
delete eventUpdateSchema.properties.metadata.default;
