import { AsyncLocalStorage } from 'node:async_hooks';

import { UserRole } from './entities/userEntity';

export interface RequestUser {
    _id: number;
    email: string;
    role: UserRole;
}

export interface RequestStore {
    user?: RequestUser;
}

const localStorage = new AsyncLocalStorage<RequestStore>();

export const getRequestLocalStorage = () => localStorage;
export const getRequestStore = () => localStorage?.getStore();
