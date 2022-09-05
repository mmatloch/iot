import { Locale } from '@definitions/localeTypes';
import { UserRole, UserState } from '@definitions/userTypes';

export const EnglishLocale: Locale = {
    generic: {
        activate: 'Activate',
        deactivate: 'Deactivate',
        edit: 'Edit',
        save: 'Save',
        cancel: 'Cancel',
    },
    i18n: {
        changeLanguage: 'Change language',
    },
    auth: {
        signIn: {
            title: 'Sign in with',
        },
        logout: 'Logout',
        errors: {
            userInactive: 'Your account is currently inactive',
        },
    },
    users: {
        title: 'Users',
        role: {
            [UserRole.Admin]: 'Admin',
            [UserRole.User]: 'User',
        },
        state: {
            [UserState.Active]: 'Active',
            [UserState.Inactive]: 'Inactive',
            [UserState.PendingApproval]: 'Pending approval',
        },
        entity: {
            email: 'Email',
            name: 'Name',
            firstName: 'First name',
            lastName: 'Last name',
            role: 'Role',
        },
        errors: {
            failedToLoadUsers: 'Failed to load users',
            failedToUpdateUser: 'Failed to update user',
        },
    },
    profile: {
        editProfile: 'Edit profile',
    },
};
