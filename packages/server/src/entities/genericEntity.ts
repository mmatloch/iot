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

const validator: Validator = createValidator();

export abstract class GenericEntity {
    #entitySchema: TObject<TProperties>;
    #dtoSchema: TObject<TProperties>;

    constructor(entitySchema: TObject<TProperties>) {
        // https://github.com/typeorm/typeorm/issues/7150
        this.#entitySchema = Type.Omit(entitySchema, ['_createdAt', '_updatedAt']);
        this.#dtoSchema = Type.Omit(this.#entitySchema, ['_id', '_version']);
    }

    @PrimaryGeneratedColumn()
    _id!: number;

    @VersionColumn()
    _version!: number;

    @CreateDateColumn()
    _createdAt!: string;

    @UpdateDateColumn()
    _updatedAt!: string;

    @BeforeInsert()
    protected validateDto() {
        validator.validateOrThrow(this.#dtoSchema, this);
    }

    @BeforeUpdate()
    protected validateEntity() {
        validator.validateOrThrow(this.#entitySchema, this);
    }
}

export const genericEntitySchema = Type.Object({
    _id: Type.Number(),
    _version: Type.Number(),
    _createdAt: Type.String(),
    _updatedAt: Type.String(),
});
