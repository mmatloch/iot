import { Type } from '@sinclair/typebox';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

export abstract class GenericEntity {
    @PrimaryGeneratedColumn()
    _id!: number;

    @VersionColumn()
    _version!: number;

    @CreateDateColumn()
    _createdAt!: string;

    @UpdateDateColumn()
    _updatedAt!: string;
}

export const genericEntitySchema = Type.Object({
    _id: Type.Number(),
    _version: Type.Number(),
    _createdAt: Type.String(),
    _updatedAt: Type.String(),
});

export type GenericEntityDto<TEntity> = Omit<TEntity, '_id' | '_version' | '_createdAt' | '_updatedAt'>;
