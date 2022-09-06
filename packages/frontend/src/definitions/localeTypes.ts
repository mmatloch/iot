import { DeviceState } from './deviceTypes';
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
        retry: string;
        errors: {
            failedToLoadData: string;
            noInternetConnection: string;
        };
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
        title: string;
        role: Record<UserRole, string>;
        state: Record<UserState, string>;
        entity: {
            email: string;
            name: string;
            firstName: string;
            lastName: string;
            role: string;
        };
        errors: {
            failedToUpdateUser: string;
        };
    };
    profile: {
        editProfile: string;
    };
    devices: {
        title: string;
        state: Record<DeviceState, string>;
    };
    configurations: {
        title: string;
        entity: {
            data: {
                topicPrefix: string;
            };
        };
        errors: {
            failedToCreateConfiguration: string;
            failedToUpdateConfiguration: string;
        };
    };
}
