import { EventState } from '@definitions/eventTypes';
import { Locale } from '@definitions/localeTypes';
import { UserRole, UserState } from '@definitions/userTypes';

export const EnglishLocale: Locale = {
    generic: {
        activate: 'Activate',
        deactivate: 'Deactivate',
        edit: 'Edit',
        save: 'Save',
        cancel: 'Cancel',
        retry: 'Retry',
        errors: {
            failedToLoadData: 'Failed to load data',
            noInternetConnection: 'Check your internet connection and try again',
        },
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
    events: {
        title: 'Events',
        state: {
            [EventState.Active]: 'Active',
            [EventState.Inactive]: 'Inactive',
            [EventState.Completed]: 'Completed',
        },
        errors: {
            failedToUpdateEvent: 'Failed to update event',
        },
    },
};
