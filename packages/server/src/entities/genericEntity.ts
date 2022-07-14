import { Validator, createValidator } from '@common/validator';
import { TObject, TProperties, Type } from '@sinclair/typebox';
import _ from 'lodash';
import {
    BeforeInsert,
    BeforeUpdate,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    VersionColumn,
} from 'typeorm';

import { mergeSchemas } from '../utils/schemaUtils';

const validator: Validator = createValidator();

abstract class AbstractGenericEntity {
    #entitySchema: TObject<TProperties>;
    #dtoSchema: TObject<TProperties>;

    constructor(entitySchema: TObject<TProperties>) {
        // https://github.com/typeorm/typeorm/issues/7150
        this.#entitySchema = mergeSchemas(
            Type.Omit(entitySchema, ['_createdAt', '_updatedAt']),
            Type.Object({
                _createdAt: Type.Unknown(),
                _updatedAt: Type.Unknown(),
            }),
        );
        this.#dtoSchema = Type.Omit(this.#entitySchema, ['_id', '_version', '_createdAt', '_updatedAt']);
    }

    @BeforeInsert()
    protected validateDto() {
        validator.validateOrThrow(this.#dtoSchema, this);
    }

    @BeforeUpdate()
    protected validateEntity() {
        validator.validateOrThrow(this.#entitySchema, this);
    }

    abstract _id: number;
    abstract _version: number;
    abstract _createdAt: string;
    abstract _updatedAt: string;
}

export class GenericEntity extends AbstractGenericEntity {
    @PrimaryGeneratedColumn()
    _id!: number;

    @VersionColumn()
    _version!: number;

    @CreateDateColumn()
    _createdAt!: string;

    @UpdateDateColumn()
    _updatedAt!: string;
}

export class GenericTimeseriesEntity extends AbstractGenericEntity {
    @PrimaryGeneratedColumn()
    _id!: number;

    @CreateDateColumn({
        primary: true,
    })
    _createdAt!: string;

    @VersionColumn()
    _version!: number;

    @UpdateDateColumn()
    _updatedAt!: string;
}

export const genericEntitySchema = Type.Object({
    _id: Type.Number(),
    _version: Type.Number(),
    _createdAt: Type.String(),
    _updatedAt: Type.String(),
});
