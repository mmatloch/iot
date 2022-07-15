import { TransformedErrorBody } from '@common/errors';
import { Static, Type } from '@sinclair/typebox';
import _ from 'lodash';
import { AfterInsert, AfterLoad, Column, Entity, Index } from 'typeorm';

import { mergeSchemas } from '../utils/schemaUtils';
import { GenericTimeseriesEntity, genericEntitySchema } from './genericEntity';

export enum EventInstanceState {
    UnknownError = 'UNKNOWN_ERROR',
    FailedOnCondition = 'FAILED_ON_CONDITION',
    FailedOnAction = 'FAILED_ON_ACTION',
    Success = 'SUCCESS',
    ConditionNotMet = 'CONDITION_NOT_MET',
}

interface EventInstancePerformanceMetricsStep {
    name: string;
    executionStartDate: string;
    executionEndDate: string;
    executionDuration: number;
}

interface EventInstancePerformanceMetrics {
    executionStartDate: string;
    executionEndDate: string;
    executionDuration: number;
    steps: EventInstancePerformanceMetricsStep[];
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
    performanceMetrics!: EventInstancePerformanceMetrics;

    @Column({
        type: 'integer',
        default: null,
        nullable: true,
    })
    triggeredByEventId?: number;

    @AfterLoad()
    @AfterInsert()
    protected removeNulls() {
        if (_.isNull(this.triggeredByEventId)) {
            this.triggeredByEventId = undefined;
        }

        if (_.isNull(this.error)) {
            this.error = undefined;
        }
    }
}

export const eventInstanceDtoSchema = Type.Object({
    eventId: Type.Integer(),
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
    triggeredByEventId: Type.Optional(Type.Integer()),
});

export const eventInstanceSchema = mergeSchemas(eventInstanceDtoSchema, genericEntitySchema);

export type EventInstanceDto = Static<typeof eventInstanceDtoSchema>;
