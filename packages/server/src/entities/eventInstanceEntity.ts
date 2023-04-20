import type { TransformedErrorBody } from '@common/errors';
import type { Static } from '@sinclair/typebox';
import { Type } from '@sinclair/typebox';
import { Column, Entity, Index } from 'typeorm';

import type { PerformanceMetrics } from '../definitions';
import { EventInstanceState } from '../definitions/eventInstanceDefinitions';
import { mergeSchemas } from '../utils/schemaUtils';
import type { Event } from './eventEntity';
import { GenericTimeseriesEntity, genericEntitySchema } from './generic/genericEntity';

@Entity({ name: 'eventinstances' })
@Index(['eventId', '_createdAt'])
export class EventInstance extends GenericTimeseriesEntity {
    constructor() {
        super(eventInstanceSchema);
    }

    @Column('integer')
    eventId!: number;

    @Column('jsonb')
    event!: Event;

    @Column({
        type: 'jsonb',
        default: '{}',
    })
    triggerContext!: Record<string, unknown>;

    @Column('text')
    state!: EventInstanceState;

    @Column({
        type: 'jsonb',
        default: null,
        nullable: true,
    })
    error?: TransformedErrorBody;

    @Column('jsonb')
    performanceMetrics!: PerformanceMetrics;

    @Column({
        type: 'integer',
        default: null,
        nullable: true,
    })
    parentEventId!: number | null;

    @Column({
        type: 'text',
        default: 'gen_random_uuid()',
    })
    eventRunId!: string;
}

export const eventInstanceDtoSchema = Type.Object({
    event: Type.Any(),
    eventId: Type.Integer(),
    parentEventId: Type.Union([Type.Null(), Type.Integer()]), // Integer must be second because Ajv will convert Null to 0
    triggerContext: Type.Record(Type.String(), Type.Unknown()),
    state: Type.Enum(EventInstanceState),
    error: Type.Optional(Type.Any()),
    performanceMetrics: Type.Object({
        executionStartDate: Type.String(),
        executionEndDate: Type.String(),
        executionDuration: Type.Number(),
        steps: Type.Array(
            Type.Object({
                name: Type.String(),
                executionStartDate: Type.String(),
                executionEndDate: Type.String(),
                executionDuration: Type.Number(),
            }),
        ),
    }),
    eventRunId: Type.String(),
});

export const eventInstanceSchema = mergeSchemas(eventInstanceDtoSchema, genericEntitySchema);
export type EventInstanceDto = Static<typeof eventInstanceDtoSchema>;
