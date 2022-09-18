import { Validator, createValidator } from '@common/validator';
import { TObject, TProperties, Type } from '@sinclair/typebox';
import _ from 'lodash';
import { BeforeInsert, BeforeUpdate, PrimaryGeneratedColumn, VersionColumn } from 'typeorm';

import { getRequestStore } from '../../requestLocalStorage';
import { mergeSchemas } from '../../utils/schemaUtils';

const validator: Validator = createValidator();

export abstract class AbstractGenericEntity {
    #entitySchema: TObject<TProperties>;
    #dtoSchema: TObject<TProperties>;

    constructor(entitySchema: TObject<TProperties>) {
        // https://github.com/typeorm/typeorm/issues/7150
        this.#entitySchema = mergeSchemas(
            Type.Omit(entitySchema, ['_createdAt', '_updatedAt', '_createdByUser', '_updatedByUser']),
            Type.Object({
                _createdAt: Type.Unknown(),
                _updatedAt: Type.Unknown(),
            }),
        );

        // https://github.com/ajv-validator/ajv/issues/1240
        this.#dtoSchema = mergeSchemas(
            Type.Omit(this.#entitySchema, [
                '_id',
                '_version',
                '_createdAt',
                '_updatedAt',
                '_createdByUser',
                '_updatedByUser',
            ]),
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

    @PrimaryGeneratedColumn()
    _id!: number;

    @VersionColumn()
    _version!: number;

    abstract _createdAt: string;
    abstract _createdBy: number | null;
    abstract _updatedAt: string;
    abstract _updatedBy: number | null;
}
