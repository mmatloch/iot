import { DeviceState } from '@definitions/entities/deviceTypes';
import { EventInstanceState } from '@definitions/entities/eventInstanceTypes';
import {
    EventActionOnInactive,
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
        statusCode: 'Status code',
        entity: {
            id: 'ID',
            state: 'State',
        },
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
            errorOccured: 'Error occured',
            unknownErrorOccured: 'An unknown error occurred',
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
        creator: {
            title: 'Device creator',
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
    bridge: {
        errors: {
            failedToRequestBridge: 'Failed to send a request to the bridge',
        },
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
        onInactive: {
            [EventActionOnInactive.Continue]: 'Continue',
            [EventActionOnInactive.Error]: 'Return error',
            [EventActionOnInactive.Skip]: 'Skip',
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
            triggerPanel: {
                buttonText: 'Trigger event',
                runId: 'Run ID',
                context: {
                    title: 'Context',
                    description:
                        'Data in JSON format with which the event will be triggered, such as data sent by the device',
                },
                options: {
                    title: 'Options',
                },
                onInactive: {
                    title: 'On inactive',
                    description: 'What should happen when this event is inactive',
                },
            },
        },
        scheduler: {
            nextTriggerAt: 'Next trigger at:',
            intervalDescription: 'Every how many seconds the event should be triggered',
            onMultipleInstancesDescription: 'What should happen when this event has already been planned. ',
        },
        errors: {
            failedToCreateEvent: 'Failed to create event',
            failedToUpdateEvent: 'Failed to update event',
            failedToTriggerEvent: 'Failed to trigger event',
            failedToParseTriggerContext: 'Failed to parse trigger context',
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
    eventInstances: {
        entity: {
            triggeredBy: 'Triggered by',
            performanceMetrics: {
                executionDuration: 'Execution duration',
                steps: 'Steps',
            },
        },
        state: {
            [EventInstanceState.ConditionNotMet]: 'Condition not met',
            [EventInstanceState.FailedOnAction]: 'Failed on action',
            [EventInstanceState.FailedOnCondition]: 'Failed on condition',
            [EventInstanceState.Success]: 'Success',
            [EventInstanceState.UnknownError]: 'Unknown error',
        },
    },
};
