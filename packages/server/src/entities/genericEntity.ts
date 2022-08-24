import { Validator, createValidator } from '@common/validator';
import { TObject, TProperties, Type } from '@sinclair/typebox';
import _ from 'lodash';
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    VersionColumn,
} from 'typeorm';

import { getRequestStore } from '../requestLocalStorage';
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

        // https://github.com/ajv-validator/ajv/issues/1240
        this.#dtoSchema = mergeSchemas(
            Type.Omit(this.#entitySchema, ['_id', '_version', '_createdAt', '_updatedAt']),
            Type.Partial(Type.Pick(this.#entitySchema, ['_id', '_version', '_createdAt', '_updatedAt'])),
        );
    }

    @BeforeInsert()
    protected beforeInsert() {
        const store = getRequestStore();
        this._createdBy = store?.user?._id || null;
        this._updatedBy = null;

        validator.validateOrThrow(this.#dtoSchema, this);
    }

    @BeforeUpdate()
    protected beforeUpdate() {
        const store = getRequestStore();
        this._updatedBy = store?.user?._id || null;

        validator.validateOrThrow(this.#entitySchema, this);
    }

    abstract _id: number;
    abstract _version: number;
    abstract _createdAt: string;
    abstract _createdBy: number | null;
    abstract _updatedAt: string;
    abstract _updatedBy: number | null;
}

export class GenericEntity extends AbstractGenericEntity {
    @PrimaryGeneratedColumn()
    _id!: number;

    @VersionColumn()
    _version!: number;

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
    @PrimaryGeneratedColumn()
    _id!: number;

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

    @VersionColumn()
    _version!: number;

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
    _updatedAt: Type.String(),
    _updatedBy: Type.Union([Type.Null(), Type.Integer()]),
});
