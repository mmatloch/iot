import { DeviceState } from '@definitions/deviceTypes';
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
            failedToUpdateUser: 'Failed to update user',
        },
    },
    profile: {
        editProfile: 'Edit profile',
    },
    devices: {
        title: 'Devices',
        state: {
            [DeviceState.Active]: 'Active',
            [DeviceState.Inactive]: 'Inactive',
            [DeviceState.Unconfigured]: 'Unconfigured',
            [DeviceState.Interviewing]: 'Interviewing',
            [DeviceState.New]: 'New',
            [DeviceState.Error]: 'Error',
        },
    },
    configurations: {
        title: 'Configurations',
        entity: {
            data: {
                topicPrefix: 'MQTT topic prefix',
            },
        },
        errors: {
            failedToCreateConfiguration: 'Failed to create configuration',
            failedToUpdateConfiguration: 'Failed to update configuration',
        },
    },
};
