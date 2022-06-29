import _ from 'lodash';

import { UserRole } from './entities/userEntity';
import { Errors } from './errors';

interface RequestUser {
    _id: string;
    email: string;
    role: UserRole;
}

export interface AccessControlSubject {
    userId: number;
    email: string;
    role: UserRole;
}

type AuthorizeReturnType<T> = AccessControlSubject & T;

const isRequestUser = (potentialSubject?: unknown): potentialSubject is RequestUser => {
    // we should also check types
    if (_.has(potentialSubject, '_id') && _.has(potentialSubject, 'email') && _.has(potentialSubject, 'role')) {
        return true;
    }

    return false;
};

const createSubject = (potentialSubject?: unknown): AccessControlSubject | undefined => {
    if (isRequestUser(potentialSubject)) {
        return {
            userId: Number(potentialSubject._id),
            email: potentialSubject.email,
            role: potentialSubject.role,
        };
    }

    return undefined;
};

export const createAccessControl = (potentialSubject?: unknown) => {
    const subject = createSubject(potentialSubject);

    const isAuthenticated = (): boolean => {
        return !!subject;
    };

    const hasRole = (role: UserRole): boolean => {
        if (subject) {
            return subject.role === role;
        }

        return false;
    };

    const hasUserId = (userId: number): boolean => {
        if (subject) {
            return subject.userId === userId;
        }

        return false;
    };

    const authorize = <T extends Partial<AccessControlSubject>>(opts?: T): AuthorizeReturnType<T> => {
        if (!isAuthenticated()) {
            throw Errors.unauthorized();
        }

        if (opts?.userId && !hasUserId(opts.userId)) {
            throw Errors.forbidden();
        }

        if (opts?.role && !hasRole(opts.role)) {
            throw Errors.forbidden();
        }

        return subject as AuthorizeReturnType<T>;
    };

    return {
        subject,
        isAuthenticated,
        hasRole,
        hasUserId,
        authorize,
    };
};
