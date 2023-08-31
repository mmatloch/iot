import type { Static } from '@sinclair/typebox';
import { Type } from '@sinclair/typebox';
import { Column, Entity } from 'typeorm';

import { mergeSchemas } from '../utils/schemaUtils';
import { GenericEntity, genericEntitySchema } from './generic/genericEntity';

@Entity({ name: 'widgets' })
export class Widget extends GenericEntity {
    constructor() {
        super(widgetSchema);
    }

    @Column('text')
    displayName!: string;

    @Column('text')
    icon!: string;

    @Column('jsonb')
    textLines!: WidgetTextLine[];

    @Column({ type: 'jsonb', nullable: true })
    action!: WidgetAction | null;
}

const widgetTextLineSchema = Type.Object({
    id: Type.String(),
    value: Type.String(),
    deviceId: Type.Union([Type.Null(), Type.Integer()]),
    eventId: Type.Union([Type.Null(), Type.Integer()]),
    styles: Type.Record(Type.String(), Type.Unknown(), {
        default: {},
    }),
});

const widgetActionEntrySchema = Type.Object({
    eventId: Type.Integer(),
    eventContext: Type.String(),
});

const widgetActionSchema = Type.Object({
    on: widgetActionEntrySchema,
    off: widgetActionEntrySchema,
    stateDefinition: Type.String(),
});

export const widgetDtoSchema = Type.Object({
    displayName: Type.String(),
    icon: Type.String(),
    textLines: Type.Array(widgetTextLineSchema),
    action: Type.Union([Type.Null(), widgetActionSchema]),
});

export const widgetSchema = mergeSchemas(widgetDtoSchema, genericEntitySchema);

export const widgetWithActionStateSchema = mergeSchemas(
    widgetSchema,
    Type.Object({
        actionState: Type.Union([Type.Null(), Type.Boolean()]),
    }),
);

export type WidgetDto = Static<typeof widgetDtoSchema>;
export type WidgetTextLine = Static<typeof widgetTextLineSchema>;
export type WidgetAction = Static<typeof widgetActionSchema>;
export type WidgetActionEntry = Static<typeof widgetActionEntrySchema>;

export const widgetActionDtoSchema = Type.Object({
    type: Type.String(),
});

export type WidgetActionDto = Static<typeof widgetActionDtoSchema>;

export type WidgetWithActionState = Static<typeof widgetWithActionStateSchema>;
