import { Type } from '@sinclair/typebox';
import { Column, Entity, Index } from 'typeorm';

import { GenericEntity, genericEntitySchema } from './genericEntity';

@Entity({ name: 'users' })
export class User extends GenericEntity {
    @Column('text')
    firstName!: string;

    @Column('text')
    lastName!: string;

    @Column('text')
    name!: string;

    @Column('text')
    @Index({ unique: true })
    email!: string;
}

export const userSchema = Type.Intersect([
    Type.Object({
        name: Type.String(),
        firstName: Type.String(),
        lastName: Type.String(),
        email: Type.String({ format: 'email' }),
    }),
    genericEntitySchema,
]);
