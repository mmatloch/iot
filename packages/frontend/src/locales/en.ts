import { DevicePowerSource, DeviceProtocol, DeviceState, DeviceType } from '@definitions/entities/deviceTypes';
import { EventInstanceState } from '@definitions/entities/eventInstanceTypes';
import { EventSchedulerTaskState } from '@definitions/entities/eventSchedulerTypes';
import {
    EventActionOnInactive,
    EventMetadataOnMultipleInstances,
    EventMetadataTaskType,
    EventState,
    EventTriggerType,
} from '@definitions/entities/eventTypes';
import { UserRole, UserState } from '@definitions/entities/userTypes';
import type { Locale } from '@definitions/localeTypes';

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
        allow: 'Allow',
        optional: 'Optional',
        statusCode: 'Status code',
        showDetails: 'Show details',
        dates: {
            createdAtAndBy: 'Created <strong>{{when}}</strong> by <strong>{{by}}</strong>',
            updatedAtAndBy: 'Updated <strong>{{when}}</strong> by <strong>{{by}}</strong>',
            createdAt: 'Created <strong>{{when}}</strong>',
            updatedAt: 'Updated <strong>{{when}}</strong>',
        },
        entity: {
            id: 'ID',
            state: 'State',
        },
        search: {
            filters: 'Filters',
            filtering: {
                title: 'Filtering',
                showOnlyActive: 'Show only active',
                filterByEvent: 'Filter by event',
                filterByDevice: 'Filter by device',
            },
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
            permissionDenied: 'Permission denied',
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
        search: {
            inputLabel: 'Search for users',
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
            [DeviceState.Interviewing]: 'Interviewing',
            [DeviceState.New]: 'New',
            [DeviceState.Error]: 'Error',
        },
        type: {
            [DeviceType.Coordinator]: 'Coordinator',
            [DeviceType.EndDevice]: 'End device',
            [DeviceType.Router]: 'Router',
            [DeviceType.Unknown]: 'Unknown device type',
            [DeviceType.Virtual]: 'Virtual device',
        },
        powerSource: {
            [DevicePowerSource.Battery]: 'Battery',
            [DevicePowerSource.Dc]: 'DC',
            [DevicePowerSource.EmergencyMains]: 'Emergency mains',
            [DevicePowerSource.MainsSinglePhase]: 'Mains single phase',
            [DevicePowerSource.MainsThreePhase]: 'Mains three phase',
            [DevicePowerSource.Unknown]: 'Unknown power source',
            [DevicePowerSource.Virtual]: 'Virtual device',
        },
        protocol: {
            [DeviceProtocol.Zigbee]: 'Zigbee',
            [DeviceProtocol.Virtual]: 'Virtual device',
        },
        entity: {
            displayName: 'Name',
            description: 'Description',
            ieeeAddress: 'IEEE address',
        },
        deactivatedBy: {
            bridge: 'Deactivated by <strong>{{name}}</strong> bridge',
            user: 'Deactivated by <strong>{{name}}</strong>',
        },
        creator: {
            title: 'Device creator',
            selectProtocolStep: {
                title: 'Select your device protocol',
                description: 'The protocol defines how to communicate with the device',
            },
            bridgeSetupStep: {
                title: 'Set the bridge configuration',
            },
            allowToJoin: {
                title: 'Allow devices to join the network',
                description: 'To allow devices to join the network joining has to be permitted',
                prompt: {
                    title: 'Do you want to allow devices to join?',
                    helper: 'This option will turn off after 5 minutes',
                },
            },
            addDevice: {
                title: 'Add device',
                lookingForDevices: 'Looking for devices',
            },
            deviceSetup: {
                title: 'Set up the device',
                deviceAdded: 'Device added successfully!',
                goToDeviceConfiguration: 'Go to the device configuration',
            },
        },
        errors: {
            failedToUpdateDevice: 'Failed to update device',
        },
        search: {
            inputLabel: 'Search for devices',
        },
    },
    configurations: {
        title: 'Configurations',
        entity: {
            data: {
                topicPrefix: 'MQTT topic prefix',
            },
        },
        zigbee: {
            mqttTopicsAndMessages: 'MQTT Topics and Messages',
        },
        errors: {
            failedToCreateConfiguration: 'Failed to create configuration',
            failedToUpdateConfiguration: 'Failed to update configuration',
            noPermissionToCreateConfiguration:
                'You do not have permission to create a configuration - <strong>please contact your system administrator</strong>',
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
        errors: {
            failedToCreateEvent: 'Failed to create event',
            failedToUpdateEvent: 'Failed to update event',
            failedToTriggerEvent: 'Failed to trigger event',
            failedToParseTriggerContext: 'Failed to parse trigger context',
            failedToParseCronExpression: 'Failed to parse CRON expression',
        },
        search: {
            inputLabel: 'Search for events',
            showOnlyUserCreated: 'Show only user-created',
        },
    },
    eventInstances: {
        title: 'Event instances',
        entity: {
            triggeredBy: 'Triggered by',
            triggerContext: 'Context',
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
    eventScheduler: {
        title: 'Event scheduler',
        state: {
            [EventSchedulerTaskState.Queued]: 'Queued',
            [EventSchedulerTaskState.Running]: 'Running',
        },
        nextTriggerAt: 'Next trigger at:',
        nextTrigger: 'Next trigger',
        intervalDescription: 'Every how many seconds the event should be triggered',
        onMultipleInstancesDescription: 'What should happen when this event has already been planned',
        errors: {
            failedToDeleteTask: 'Failed to cancel scheduled task',
        },
    },
};
