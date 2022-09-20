import type { User } from './userTypes';

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
