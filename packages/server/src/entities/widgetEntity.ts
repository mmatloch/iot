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
}

const widgetTextLineSchema = Type.Object({
    id: Type.String(),
    value: Type.String(),
    deviceId: Type.Union([Type.Null(), Type.Integer()]),
    eventId: Type.Union([Type.Null(), Type.Integer()]),
});

export const widgetDtoSchema = Type.Object({
    displayName: Type.String(),
    icon: Type.String(),
    textLines: Type.Array(widgetTextLineSchema),
});

export const widgetSchema = mergeSchemas(widgetDtoSchema, genericEntitySchema);

export type WidgetDto = Static<typeof widgetDtoSchema>;
export type WidgetTextLine = Static<typeof widgetTextLineSchema>;
