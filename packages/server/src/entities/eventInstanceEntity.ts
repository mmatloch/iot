import { TransformedErrorBody } from '@common/errors';
import { Static, Type } from '@sinclair/typebox';
import { Column, Entity, Index } from 'typeorm';

import { PerformanceMetrics } from '../definitions';
import { mergeSchemas } from '../utils/schemaUtils';
import { GenericTimeseriesEntity, genericEntitySchema } from './generic/genericEntity';

export enum EventInstanceState {
    UnknownError = 'UNKNOWN_ERROR',
    FailedOnCondition = 'FAILED_ON_CONDITION',
    FailedOnAction = 'FAILED_ON_ACTION',
    Success = 'SUCCESS',
    ConditionNotMet = 'CONDITION_NOT_MET',
}

@Entity({ name: 'eventinstances' })
@Index(['eventId', '_createdAt'])
export class EventInstance extends GenericTimeseriesEntity {
    constructor() {
        super(eventInstanceSchema);
    }

    @Column('integer')
    eventId!: number;

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
