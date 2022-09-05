import { UserRole, UserState } from './userTypes';

export enum AvailableLanguage {
    English = 'en',
    Polish = 'pl',
}

export interface Locale {
    generic: {
        activate: string;
        deactivate: string;
        edit: string;
        save: string;
        cancel: string;
    };
    i18n: {
        changeLanguage: string;
    };
    auth: {
        signIn: {
            title: string;
        };
        logout: string;
        errors: {
            userInactive: string;
        };
    };
    users: {
        role: {
            [UserRole.Admin]: string;
            [UserRole.User]: string;
        };
        state: {
            [UserState.Active]: string;
            [UserState.Inactive]: string;
            [UserState.PendingApproval]: string;
        };
        entity: {
            email: string;
            name: string;
            firstName: string;
            lastName: string;
            role: string;
        };
        management: {
            title: string;
        };
        errors: {
            failedToLoadUsers: string;
            failedToUpdateUser: string;
        };
    };
    profile: {
        editProfile: string;
    };
}
