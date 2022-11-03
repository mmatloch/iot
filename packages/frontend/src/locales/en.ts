import {
    EventMetadataOnMultipleInstances,
    EventMetadataTaskType,
    EventState,
    EventTriggerType,
} from '@definitions/entities/eventTypes';
import { UserRole, UserState } from '@definitions/entities/userTypes';
import { Locale } from '@definitions/localeTypes';

export const EnglishLocale: Locale = {
    generic: {
        activate: 'Activate',
        deactivate: 'Deactivate',
        edit: 'Edit',
        save: 'Save',
        cancel: 'Cancel',
        retry: 'Retry',
        default: 'Default',
        error: 'Error',
        clear: 'Clear',
        create: 'Create',
        search: {
            filters: 'Filters',
            filtering: 'Filtering',
            sorting: {
                title: 'Sorting',
                oldestFirst: 'Oldest first',
                newestFirst: 'Newest first',
                recentlyUpdated: 'Recently updated',
            },
        },
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
        triggerType: {
            [EventTriggerType.Api]: 'By application',
            [EventTriggerType.IncomingDeviceData]: 'Incoming device data',
            [EventTriggerType.OutgoingDeviceData]: 'Outgoing device data',
            [EventTriggerType.Scheduler]: 'Scheduler',
        },
        metadataOnMultipleInstances: {
            [EventMetadataOnMultipleInstances.Create]: 'Create a new task',
            [EventMetadataOnMultipleInstances.Replace]: 'Replace the current task',
            [EventMetadataOnMultipleInstances.Skip]: 'Skip the planning',
        },
        metadataTaskType: {
            [EventMetadataTaskType.RelativeCron]: 'Relative CRON',
            [EventMetadataTaskType.RelativeInterval]: 'Relative interval',
            [EventMetadataTaskType.StaticCron]: 'Static CRON',
            [EventMetadataTaskType.StaticInterval]: 'Static interval',
        },
        entity: {
            displayName: 'Name',
            triggerType: 'Trigger type',
            metadata: {
                retryImmediatelyAfterBoot: 'Retry immediately after boot',
                recurring: 'Recurring',
                runAfterEvent: 'Run after event',
                interval: 'Interval',
                cronExpression: 'CRON expression',
                taskType: 'Task type',
                onMultipleInstances: 'On multiple instances',
            },
        },
        editor: {
            creator: {
                title: 'Event creator',
            },
            editor: {
                title: 'Event editor',
            },
            basicInformation: {
                title: 'Basic information',
            },
            conditionDefinition: {
                title: 'Condition definition',
            },
            actionDefinition: {
                title: 'Action definition',
            },
            triggerFilters: {
                title: 'Trigger filters',
                description: 'Filters determine how the system can find an event',
                forDevice: 'For device',
            },
            openInEditor: 'Open in event editor',
        },
        scheduler: {
            nextTriggerAt: 'Next trigger at:',
            intervalDescription: 'Every how many seconds the event should be triggered',
            onMultipleInstancesDescription: 'What should happen when this event has already been planned. ',
        },
        errors: {
            failedToCreateEvent: 'Failed to create event',
            failedToUpdateEvent: 'Failed to update event',
            failedToParseCronExpression: 'Failed to parse CRON expression',
        },
        dates: {
            createdAt: 'Created <strong>{{when}}</strong> by <strong>{{by}}</strong>',
            updatedAt: 'Updated <strong>{{when}}</strong> by <strong>{{by}}</strong>',
        },
        search: {
            showOnlyActive: 'Show only active',
            showOnlyUserCreated: 'Show only user-created',
        },
    },
};
