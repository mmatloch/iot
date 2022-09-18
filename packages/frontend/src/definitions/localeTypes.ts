import { EventState, EventTriggerType } from './eventTypes';
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
        default: string;
        search: {
            filters: string;
            filtering: string;
            sorting: {
                title: string;
                oldestFirst: string;
                newestFirst: string;
                recentlyUpdated: string;
            };
        };
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
        errors: {
            failedToLoadUsers: string;
            failedToUpdateUser: string;
        };
    };
    profile: {
        editProfile: string;
    };
    events: {
        title: string;
        state: Record<EventState, string>;
        triggerType: Record<EventTriggerType, string>;
        entity: {
            triggerType: string;
        };
        errors: {
            failedToUpdateEvent: string;
        };
        dates: {
            createdAt: string;
            updatedAt: string;
        };
        search: {
            showOnlyActive: string;
            showOnlyUserCreated: string;
        };
    };
}
