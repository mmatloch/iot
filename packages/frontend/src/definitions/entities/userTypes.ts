import type { GenericEntity } from '../commonTypes';

export enum UserRole {
    Admin = 'ADMIN',
    User = 'USER',
}

export enum UserState {
    Active = 'ACTIVE',
    Inactive = 'INACTIVE',
    PendingApproval = 'PENDING_APPROVAL',
}

export interface User extends GenericEntity {
    name: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
    email: string;
    role: UserRole;
    state: UserState;
}
