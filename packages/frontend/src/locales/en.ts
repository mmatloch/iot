import { Locale } from '@definitions/localeTypes';
import { UserRole, UserState } from '@definitions/userTypes';

export const EnglishLocale: Locale = {
    generic: {
        activate: 'Activate',
        deactivate: 'Deactivate',
        edit: 'Edit',
    },
    auth: {
        signIn: {
            title: 'Sign in with',
        },
        logout: 'Logout',
    },
    users: {
        role: {
            [UserRole.Admin]: 'Admin',
            [UserRole.User]: 'User',
        },
        state: {
            [UserState.Active]: 'Active',
            [UserState.Inactive]: 'Inactive',
            [UserState.PendingApproval]: 'Pending approval',
        },
        management: {
            title: 'User management',
            failedToLoadUsers: 'Failed to load users',
        },
    },
};
