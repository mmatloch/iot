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
        widget: Type.Optional(Type.Unknown()),
        width: Type.Integer(),
        height: Type.Integer(),
        positionX: Type.Integer(),
        positionY: Type.Integer(),
    },
    { additionalProperties: false },
);

export const dashboardDtoSchema = Type.Object({
    displayName: Type.String(),
    index: Type.Integer(),
    layout: Type.Array(dashboardLayoutItemDtoSchema),
});

const dashboardDtoWithUserIdSchema = Type.Object({
    displayName: Type.String(),
    userId: Type.Integer(),
    index: Type.Integer(),
    layout: Type.Array(dashboardLayoutItemDtoSchema),
});

export const dashboardSchema = mergeSchemas(dashboardDtoWithUserIdSchema, genericEntitySchema);

export type DashboardDto = Static<typeof dashboardDtoWithUserIdSchema>;
export type DashboardLayoutItemDto = Static<typeof dashboardLayoutItemDtoSchema>;

export const reorderDashboardsDtoSchema = Type.Array(
    Type.Object({
        dashboardId: Type.Integer(),
        index: Type.Integer(),
    }),
);

export type ReorderDashboardsDto = Static<typeof reorderDashboardsDtoSchema>;

export const shareDashboardDtoSchema = Type.Object({
    userIds: Type.Array(Type.Integer()),
});

export type ShareDashboardDto = Static<typeof shareDashboardDtoSchema>;
