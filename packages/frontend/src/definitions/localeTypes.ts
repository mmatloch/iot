import {
    EventActionOnInactive,
    EventMetadataOnMultipleInstances,
    EventMetadataTaskType,
    EventState,
    EventTriggerType,
} from './entities/eventTypes';
import { UserRole, UserState } from './entities/userTypes';

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
        error: string;
        clear: string;
        create: string;
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
        metadataOnMultipleInstances: Record<EventMetadataOnMultipleInstances, string>;
        metadataTaskType: Record<EventMetadataTaskType, string>;
        onInactive: Record<EventActionOnInactive, string>;
        entity: {
            displayName: string;
            triggerType: string;
            metadata: {
                retryImmediatelyAfterBoot: string;
                recurring: string;
                runAfterEvent: string;
                interval: string;
                cronExpression: string;
                taskType: string;
                onMultipleInstances: string;
            };
        };
        editor: {
            creator: {
                title: string;
            };
            editor: {
                title: string;
            };
            basicInformation: {
                title: string;
            };
            conditionDefinition: {
                title: string;
            };
            actionDefinition: {
                title: string;
            };
            triggerFilters: {
                title: string;
                description: string;
                forDevice: string;
            };
            openInEditor: string;
            triggerPanel: {
                buttonText: string;
                context: {
                    title: string;
                    description: string;
                };
                options: {
                    title: string;
                };
                onInactive: {
                    title: string;
                    description: string;
                };
            };
        };
        scheduler: {
            nextTriggerAt: string;
            intervalDescription: string;
            onMultipleInstancesDescription: string;
        };
        errors: {
            failedToCreateEvent: string;
            failedToUpdateEvent: string;
            failedToTriggerEvent: string;
            failedToParseTriggerContext: string;
            failedToParseCronExpression: string;
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
