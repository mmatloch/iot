import { Type } from '@sinclair/typebox';
import _ from 'lodash';
import { Column, CreateDateColumn, JoinColumn, ManyToOne, UpdateDateColumn } from 'typeorm';

import { User } from '../userEntity';
import { AbstractGenericEntity } from './abstractGenericEntity';

export class GenericEntity extends AbstractGenericEntity {
    @CreateDateColumn()
    _createdAt!: string;

    @Column({
        type: 'integer',
        nullable: true,
        default: null,
    })
    _createdBy!: number | null;

    @ManyToOne(() => User, { eager: true, createForeignKeyConstraints: false })
    @JoinColumn({ name: '_createdBy' })
    _createdByUser!: User | null;

    @UpdateDateColumn()
    _updatedAt!: string;

    @Column({
        type: 'integer',
        nullable: true,
        default: null,
    })
    _updatedBy!: number | null;

    @ManyToOne(() => User, { eager: true, createForeignKeyConstraints: false })
    @JoinColumn({ name: '_updatedBy' })
    _updatedByUser!: User | null;
}

export class GenericTimeseriesEntity extends AbstractGenericEntity {
    @CreateDateColumn({
        primary: true,
    })
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

export const genericEntitySchema = Type.Object({
    _id: Type.Integer(),
    _version: Type.Integer(),
    _createdAt: Type.String(),
    _createdBy: Type.Union([Type.Null(), Type.Integer()]),
    _createdByUser: Type.Any(),
    _updatedAt: Type.String(),
    _updatedBy: Type.Union([Type.Null(), Type.Integer()]),
    _updatedByUser: Type.Any(),
});
