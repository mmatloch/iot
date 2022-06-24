import _ from 'lodash';

import { UserRole } from './entities/userEntity';
import { Errors } from './errors';

interface Subject {
    _id: number;
    email: string;
    role: UserRole;
}

const isSubject = (potentialSubject?: unknown): potentialSubject is Subject => {
    // we should also check types
    if (_.has(potentialSubject, '_id') && _.has(potentialSubject, 'email') && _.has(potentialSubject, 'role')) {
        return true;
    }

    return false;
};

const createSubject = (potentialSubject?: unknown): Subject | undefined => {
    if (isSubject(potentialSubject)) {
        return potentialSubject;
    }

    return undefined;
};

interface AssertOptions {
    role?: UserRole;
}

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

    const assert = (opts: AssertOptions): void => {
        if (!isAuthenticated()) {
            throw Errors.unauthorized();
        }

        if (opts.role && !hasRole(opts.role)) {
            throw Errors.forbidden();
        }
    };

    return {
        subject,
        isAuthenticated,
        assert,
    };
};
