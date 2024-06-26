import type { DevicePowerSource, DeviceProtocol, DeviceState, DeviceType } from './entities/deviceTypes';
import type { EventInstanceState } from './entities/eventInstanceTypes';
import type { EventSchedulerTaskState } from './entities/eventSchedulerTypes';
import type {
    EventActionOnInactive,
    EventMetadataOnMultipleInstances,
    EventMetadataTaskType,
    EventState,
    EventTriggerType,
} from './entities/eventTypes';
import type { UserRole, UserState } from './entities/userTypes';

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
        allow: string;
        optional: string;
        statusCode: string;
        showDetails: string;
        value: string;
        delete: string;
        share: string;
        on: string;
        off: string;
        dates: {
            createdAt: string;
            createdAtAndBy: string;
            updatedAt: string;
            updatedAtAndBy: string;
        };
        entity: {
            id: string;
            state: string;
        };
        search: {
            filters: string;
            filtering: {
                title: string;
                showOnlyActive: string;
                filterByEvent: string;
                filterByDevice: string;
                filterByWidget: string;
            };
            sorting: {
                title: string;
                oldestFirst: string;
                newestFirst: string;
                recentlyUpdated: string;
            };
            selecting: {
                selectDevice: string;
                selectEvent: string;
            };
        };
        errors: {
            failedToLoadData: string;
            noInternetConnection: string;
            errorOccured: string;
            unknownErrorOccured: string;
            permissionDenied: string;
        };
        websockets: {
            connectionOpened: string;
            connectionLost: string;
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
        search: {
            inputLabel: string;
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
        entityName: string;
        state: Record<DeviceState, string>;
        powerSource: Record<DevicePowerSource, string>;
        type: Record<DeviceType, string>;
        protocol: Record<DeviceProtocol, string>;
        entity: {
            id: string;
            displayName: string;
            description: string;
            ieeeAddress: string;
        };
        featureNames: {
            power: string;
            state: string;
            energy: string;
            current: string;
            voltage: string;
            linkquality: string;
            temperature: string;
            humidity: string;
            battery: string;
            illuminance: string;
            action: string;
        };
        deactivatedBy: {
            bridge: string;
            user: string;
        };
        creator: {
            title: string;
            selectProtocolStep: {
                title: string;
                description: string;
            };
            bridgeSetupStep: {
                title: string;
            };
            allowToJoin: {
                title: string;
                description: string;
                prompt: {
                    title: string;
                    helper: string;
                };
            };
            addDevice: {
                title: string;
                lookingForDevices: string;
            };
            deviceSetup: {
                title: string;
                deviceAdded: string;
                goToDeviceConfiguration: string;
            };
        };
        search: {
            inputLabel: string;
        };
        errors: {
            failedToUpdateDevice: string;
        };
    };
    configurations: {
        title: string;
        entity: {
            data: {
                topicPrefix: string;
            };
        };
        zigbee: {
            mqttTopicsAndMessages: string;
        };
        errors: {
            failedToCreateConfiguration: string;
            failedToUpdateConfiguration: string;
            noPermissionToCreateConfiguration: string;
        };
    };
    bridge: {
        errors: {
            failedToRequestBridge: string;
        };
    };
    events: {
        title: string;
        entityName: string;
        state: Record<EventState, string>;
        triggerType: Record<EventTriggerType, string>;
        metadataOnMultipleInstances: Record<EventMetadataOnMultipleInstances, string>;
        metadataTaskType: Record<EventMetadataTaskType, string>;
        onInactive: Record<EventActionOnInactive, string>;
        entity: {
            id: string;
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
                runId: string;
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

        errors: {
            failedToCreateEvent: string;
            failedToUpdateEvent: string;
            failedToTriggerEvent: string;
            failedToParseTriggerContext: string;
            failedToParseCronExpression: string;
        };
        search: {
            inputLabel: string;
            showOnlyUserCreated: string;
        };
    };
    eventInstances: {
        title: string;
        entity: {
            triggeredBy: string;
            triggerContext: string;
            performanceMetrics: {
                executionDuration: string;
                steps: string;
            };
        };
        state: Record<EventInstanceState, string>;
    };
    eventScheduler: {
        title: string;
        state: Record<EventSchedulerTaskState, string>;
        nextTriggerAt: string;
        nextTrigger: string;
        intervalDescription: string;
        onMultipleInstancesDescription: string;
        errors: {
            failedToDeleteTask: string;
        };
    };
    dashboards: {
        title: string;
        entity: {
            displayName: string;
        };
        creator: {
            title: string;
            addWidget: string;
            defaults: {
                displayName: string;
            };
        };
        editor: {
            title: string;
        };
        share: {
            title: string;
            dashboardSharedSuccessfully: string;
        };
        errors: {
            failedToCreateDashboard: string;
            failedToUpdateDashboard: string;
            failedToDeleteDashboard: string;
            failedToShareDashboard: string;
        };
    };
    widgets: {
        title: string;
        entity: {
            displayName: string;
            icon: string;
        };
        creator: {
            title: string;
            defaults: {
                displayName: string;
                icon: string;
            };
            addTextLine: string;
            useDeviceSensorData: string;
            addAction: string;
            removeAction: string;
            actionOnDefinition: string;
            actionOnContextDefinition: string;
            actionOffDefinition: string;
            actionOffContextDefinition: string;
            actionStateDefintion: {
                title: string;
                description: string;
            };
        };
        editor: {
            title: string;
        };
        errors: {
            failedToCreateWidget: string;
            failedToUpdateWidget: string;
            failedToDeleteWidget: string;
            failedToTriggerAction: string;
        };
    };
}
