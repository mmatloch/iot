import _ from 'lodash';

import { UserRole } from './entities/userEntity';
import { Errors } from './errors';
import { getRequestStore } from './requestLocalStorage';

export interface AccessControlSubject {
    userId: number;
    email: string;
    role: UserRole;
}

type AuthorizeReturnType<T> = AccessControlSubject & T;

const createSubject = (): AccessControlSubject | undefined => {
    const store = getRequestStore();

    const user = store?.user;

    if (user) {
        return {
            userId: user._id,
            email: user.email,
            role: user.role,
        };
    }

    return undefined;
};

export const createAccessControl = () => {
    const subject = createSubject();

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
