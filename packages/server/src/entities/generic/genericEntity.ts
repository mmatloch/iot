import { Type } from '@sinclair/typebox';
import _ from 'lodash';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { AbstractGenericEntity } from './abstractGenericEntity';

export class GenericEntity extends AbstractGenericEntity {
    @CreateDateColumn()
    _createdAt!: string;

    @UpdateDateColumn()
    _updatedAt!: string;
}

export class GenericTimeseriesEntity extends AbstractGenericEntity {
    @CreateDateColumn({
        primary: true,
    })
    _createdAt!: string;

    @UpdateDateColumn()
    _updatedAt!: string;
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
