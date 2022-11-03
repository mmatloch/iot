import type { User } from './entities/userTypes';

export interface GenericEntity {
    _id: number;
    _version: number;
    _createdAt: string;
    _createdBy: number | null;
    _createdByUser: User | null;
    _updatedAt: string;
    _updatedBy: number | null;
    _updatedByUser: User | null;
}

export const GENERIC_ENTITY_FIELDS = [
    '_id',
    '_version',
    '_createdAt',
    '_createdBy',
    '_createdByUser',
    '_updatedAt',
    '_updatedBy',
    '_updatedByUser',
];
