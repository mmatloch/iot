import { Static, Type } from '@sinclair/typebox';
import { Column, Entity, Index } from 'typeorm';

import { mergeSchemas } from '../utils/schemaUtils';
import { GenericTimeseriesEntity, genericEntitySchema } from './generic/genericEntity';

@Entity({ name: 'sensordata' })
@Index(['deviceId', '_createdAt'])
export class SensorData extends GenericTimeseriesEntity {
    constructor() {
        super(sensorDataSchema);
    }

    @Column('integer')
    deviceId!: number;

    @Column({
        type: 'jsonb',
        default: '{}',
    })
    data!: Record<string, unknown>;
}

export const sensorDataDtoSchema = Type.Object({
    deviceId: Type.Integer(),
    data: Type.Record(Type.String(), Type.Unknown()),
});

export const sensorDataSchema = mergeSchemas(sensorDataDtoSchema, genericEntitySchema);

export type SensorDataDto = Static<typeof sensorDataDtoSchema>;
