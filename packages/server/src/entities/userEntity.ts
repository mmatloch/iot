import { Static, Type } from '@sinclair/typebox';
import { Column, Entity, Index } from 'typeorm';

import { mergeSchemas } from '../utils/schemaUtils';
import { GenericEntity, genericEntitySchema } from './genericEntity';

export enum UserRole {
    Admin = 'ADMIN',
    User = 'USER',
}

export enum UserState {
    Active = 'ACTIVE',
    Inactive = 'INACTIVE',
    PendingApproval = 'PENDING_APPROVAL',
}

@Entity({ name: 'users' })
export class User extends GenericEntity {
    constructor() {
        super(userSchema);
    }

    @Column('text')
    firstName!: string;

    @Column('text')
    lastName!: string;

    @Column('text')
    name!: string;

    @Column('text')
    avatarUrl!: string;

    @Column('text')
    @Index({ unique: true })
    email!: string;

    @Column('text')
    role!: UserRole;

    @Column('text')
    state!: UserState;
}

export const userDtoSchema = Type.Object({
    name: Type.String(),
    firstName: Type.String(),
    lastName: Type.String(),
    avatarUrl: Type.String(),
    email: Type.String({ format: 'email' }),
    role: Type.Enum(UserRole),
    state: Type.Enum(UserState),
});

export const userSchema = mergeSchemas(userDtoSchema, genericEntitySchema);

export type UserDto = Static<typeof userDtoSchema>;
