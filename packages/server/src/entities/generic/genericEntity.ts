import { Type } from '@sinclair/typebox';
import _ from 'lodash';
import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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

    @UpdateDateColumn()
    _updatedAt!: string;

    @Column({
        type: 'integer',
        nullable: true,
        default: null,
    })
    _updatedBy!: number | null;
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
