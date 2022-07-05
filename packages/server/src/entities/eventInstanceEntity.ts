import { TransformedErrorBody } from '@common/application';
import { Static, Type } from '@sinclair/typebox';
import { Column, Entity, Index } from 'typeorm';

import { mergeSchemas } from '../utils/schemaUtils';
import { GenericTimeseriesEntity, genericEntitySchema } from './genericEntity';

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
}

export const eventInstanceDtoSchema = Type.Object({
    eventId: Type.Integer(),
    triggerContext: Type.Record(Type.String(), Type.Unknown()),
    state: Type.Enum(EventInstanceState),
    error: Type.Optional(Type.Any()),
});

export const eventInstanceSchema = mergeSchemas(eventInstanceDtoSchema, genericEntitySchema);

export type EventInstanceDto = Static<typeof eventInstanceDtoSchema>;
