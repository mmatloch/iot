import type { Static } from '@sinclair/typebox';
import { Type } from '@sinclair/typebox';
import { Column, Entity } from 'typeorm';

import { mergeSchemas } from '../utils/schemaUtils';
import { GenericEntity, genericEntitySchema } from './generic/genericEntity';

@Entity({ name: 'dashboards' })
export class Dashboard extends GenericEntity {
    constructor() {
        super(dashboardSchema);
    }

    @Column('integer')
    userId!: number;

    @Column('text')
    displayName!: string;

    @Column('integer')
    index!: number;

    @Column('jsonb')
    layout!: DashboardLayoutItemDto[];
}

const dashboardLayoutItemDtoSchema = Type.Object(
    {
        widgetId: Type.Integer(),
        width: Type.Integer(),
        height: Type.Integer(),
        positionX: Type.Integer(),
        positionY: Type.Integer(),
    },
    { additionalProperties: false },
);

export const dashboardDtoSchema = Type.Object({
    userId: Type.Integer(),
    displayName: Type.String(),
    index: Type.Integer(),
    layout: Type.Array(dashboardLayoutItemDtoSchema),
});

export const dashboardSchema = mergeSchemas(dashboardDtoSchema, genericEntitySchema);

export type DashboardDto = Static<typeof dashboardDtoSchema>;
export type DashboardLayoutItemDto = Static<typeof dashboardLayoutItemDtoSchema>;
