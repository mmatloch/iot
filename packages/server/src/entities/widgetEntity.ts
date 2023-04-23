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
}

export const widgetDtoSchema = Type.Object({
    displayName: Type.String(),
    icon: Type.String(),
});

export const widgetSchema = mergeSchemas(widgetDtoSchema, genericEntitySchema);

export type WidgetDto = Static<typeof widgetDtoSchema>;
