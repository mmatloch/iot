import { Static, Type } from '@sinclair/typebox';
import { Column, CreateDateColumn, Entity, Index, ManyToOne, UpdateDateColumn } from 'typeorm';

import { mergeSchemas } from '../utils/schemaUtils';
import { AbstractGenericEntity } from './generic/abstractGenericEntity';

export enum UserRole {
    Admin = 'ADMIN',
    User = 'USER',
}

export enum UserState {
    Active = 'ACTIVE',
    Inactive = 'INACTIVE',
    PendingApproval = 'PENDING_APPROVAL',
}

class GenericEntity extends AbstractGenericEntity {
    @CreateDateColumn()
    _createdAt!: string;

    @Column({
        type: 'integer',
        nullable: true,
        default: null,
    })
    _createdBy!: number | null;

    @UpdateDateColumn()
    _updatedAt!: string;

    @Column({
        type: 'integer',
        nullable: true,
        default: null,
    })
    _updatedBy!: number | null;
}

const genericEntitySchema = Type.Object({
    _id: Type.Integer(),
    _version: Type.Integer(),
    _createdAt: Type.String(),
    _createdBy: Type.Union([Type.Null(), Type.Integer()]),
    _updatedAt: Type.String(),
    _updatedBy: Type.Union([Type.Null(), Type.Integer()]),
});

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
