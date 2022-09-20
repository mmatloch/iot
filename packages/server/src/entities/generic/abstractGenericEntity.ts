import { Validator, createValidator } from '@common/validator';
import { TObject, TProperties, Type } from '@sinclair/typebox';
import _ from 'lodash';
import {
    AfterLoad,
    BeforeInsert,
    BeforeUpdate,
    Column,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    VersionColumn,
} from 'typeorm';

import { getRequestStore } from '../../requestLocalStorage';
import { mergeSchemas } from '../../utils/schemaUtils';
import type { User } from '../userEntity';

const validator: Validator = createValidator();

type Schema = TObject<TProperties>;

const schemaCache = new Map<
    Schema,
    {
        entitySchema: Schema;
        dtoSchema: Schema;
    }
>();

const getSchemas = (schema: Schema) => {
    const fromCache = schemaCache.get(schema);
    if (fromCache) {
        return fromCache;
    }

    // https://github.com/typeorm/typeorm/issues/7150
    const entitySchema = mergeSchemas(
        Type.Omit(schema, ['_createdAt', '_updatedAt', '_createdByUser', '_updatedByUser']),
        Type.Object({
            _createdAt: Type.Unknown(),
            _updatedAt: Type.Unknown(),
        }),
    );

    // https://github.com/ajv-validator/ajv/issues/1240
    const dtoSchema = mergeSchemas(
        Type.Omit(schema, ['_id', '_version', '_createdAt', '_updatedAt', '_createdByUser', '_updatedByUser']),
        Type.Partial(Type.Pick(schema, ['_id', '_version', '_createdAt', '_updatedAt'])),
    );

    schemaCache.set(schema, {
        entitySchema,
        dtoSchema,
    });

    return {
        entitySchema,
        dtoSchema,
    };
};

export abstract class AbstractGenericEntity {
    #entitySchema: Schema;
    #dtoSchema: Schema;

    constructor(schema: Schema) {
        const { entitySchema, dtoSchema } = getSchemas(schema);

        this.#entitySchema = entitySchema;
        this.#dtoSchema = dtoSchema;
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

    @AfterLoad()
    protected afterLoad() {
        if (_.isUndefined(this._createdByUser)) {
            this._createdByUser = null;
        }
        if (_.isUndefined(this._updatedByUser)) {
            this._updatedByUser = null;
        }
    }

    @PrimaryGeneratedColumn()
    _id!: number;

    @VersionColumn()
    _version!: number;

    @ManyToOne('User', {
        createForeignKeyConstraints: false,
        nullable: true,
        persistence: false,
        cascade: false,
    })
    @JoinColumn({ name: '_createdBy' })
    _createdByUser!: User | null;

    @ManyToOne('User', {
        createForeignKeyConstraints: false,
        nullable: true,
        persistence: false,
        cascade: false,
    })
    @JoinColumn({ name: '_updatedBy' })
    _updatedByUser!: User | null;

    @Column({
        type: 'integer',
        nullable: true,
    })
    _createdBy!: number | null;

    @Column({
        type: 'integer',
        nullable: true,
    })
    _updatedBy!: number | null;

    abstract _createdAt: string;
    abstract _updatedAt: string;
}
