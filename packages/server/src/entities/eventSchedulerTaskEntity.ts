import { Static, Type } from '@sinclair/typebox';
import _ from 'lodash';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { mergeSchemas } from '../utils/schemaUtils';
import { Event } from './eventEntity';
import { GenericEntity, genericEntitySchema } from './generic/genericEntity';

export enum EventSchedulerTaskState {
    Queued = 'QUEUED',
    Running = 'RUNNING',
}

@Entity({ name: 'eventschedulertasks' })
export class EventSchedulerTask extends GenericEntity {
    constructor() {
        super(eventSchedulerTaskSchema);
    }

    @Column('integer')
    eventId!: number;

    @ManyToOne(() => Event, { eager: true, onDelete: 'NO ACTION' })
    @JoinColumn({ name: 'eventId' })
    event!: Event;

    @Column({
        type: 'timestamp',
        transformer: {
            to: (v: string) => v,
            from: (v: Date) => v.toISOString(),
        },
    })
    nextRunAt!: string;

    @Column('text')
    state!: EventSchedulerTaskState;
}

export const eventSchedulerTaskDtoSchema = Type.Object(
    {
        event: Type.Any(),
        eventId: Type.Integer(),
        nextRunAt: Type.String(),
        state: Type.Enum(EventSchedulerTaskState),
    },
    {
        additionalProperties: false,
    },
);

export interface EventSchedulerTaskDto {
    event: Event;
    nextRunAt: string;
    state: EventSchedulerTaskState;
}

export const eventSchedulerTaskSchema = mergeSchemas(eventSchedulerTaskDtoSchema, genericEntitySchema);

export const eventSchedulerTaskSearchQuerySchema = Type.Partial(
    mergeSchemas(
        Type.Omit(eventSchedulerTaskDtoSchema, ['event']),
        Type.Object({
            eventId: Type.Integer(),
        }),
    ),
);

export type EventSchedulerTaskSearchQuery = Static<typeof eventSchedulerTaskSearchQuerySchema>;
