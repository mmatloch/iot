    declare enum UserRole {
        Admin = "ADMIN",
        User = "USER"
    }
    declare enum UserState {
        Active = "ACTIVE",
        Inactive = "INACTIVE",
        PendingApproval = "PENDING_APPROVAL"
    }
    declare interface User extends GenericEntity {
        name: string;
        firstName: string;
        lastName: string;
        avatarUrl: string;
        email: string;
        role: UserRole;
        state: UserState;
    }
    declare interface GenericEntity {
        _id: number;
        _version: number;
        _createdAt: string;
        _createdBy: number | null;
        _createdByUser: User | null;
        _updatedAt: string;
        _updatedBy: number | null;
        _updatedByUser: User | null;
    }
    declare const GENERIC_ENTITY_FIELDS: string[];
    declare enum DeviceType {
        Unknown = "UNKNOWN",
        Coordinator = "COORDINATOR",
        EndDevice = "END_DEVICE",
        Router = "ROUTER",
        Virtual = "VIRTUAL"
    }
    declare enum DevicePowerSource {
        Unknown = "UNKNOWN",
        Battery = "BATTERY",
        MainsSinglePhase = "MAINS_SINGLE_PHASE",
        MainsThreePhase = "MAINS_THREE_PHASE",
        EmergencyMains = "EMERGENCY_MAINS",
        Dc = "DC",
        Virtual = "VIRTUAL"
    }
    declare enum DeviceProtocol {
        Zigbee = "ZIGBEE",
        Virtual = "VIRTUAL"
    }
    declare enum DeviceState {
        Active = "ACTIVE",
        Inactive = "INACTIVE",
        Unconfigured = "UNCONFIGURED",
        Interviewing = "INTERVIEWING",
        Error = "ERROR",
        New = "NEW"
    }
    declare enum DeviceDeactivatedByType {
        Bridge = "BRIDGE",
        User = "USER"
    }
    type DeviceDeactivatedBy = {
        type: DeviceDeactivatedByType.Bridge;
        name: string;
    } | {
        type: DeviceDeactivatedByType.User;
        id: number;
    };
    declare interface Device extends GenericEntity {
        displayName: string;
        model: string;
        vendor: string;
        manufacturer: string;
        description: string;
        ieeeAddress: string;
        powerSource: DevicePowerSource;
        type: DeviceType;
        protocol: DeviceProtocol;
        state: DeviceState;
        deactivatedBy: DeviceDeactivatedBy | null;
    }
    declare interface SearchResponse<TEntity extends GenericEntity> {
        _hits: TEntity[];
        _meta: {
            totalHits: number;
            totalPages?: number;
        };
    }
    declare enum SortValue {
        Asc = "ASC",
        Desc = "DESC"
    }
    declare interface SearchQuery<TEntity extends GenericEntity> extends Record<string, unknown> {
        size?: number;
        page?: number;
        sort?: {
            [key in keyof TEntity]?: SortValue;
        };
        relations?: {
            [key in keyof TEntity]?: boolean;
        };
    }
    declare enum EventTriggerType {
        Api = "API",
        IncomingDeviceData = "INCOMING_DEVICE_DATA",
        OutgoingDeviceData = "OUTGOING_DEVICE_DATA",
        Scheduler = "SCHEDULER"
    }
    declare enum EventState {
        Active = "ACTIVE",
        Inactive = "INACTIVE",
        Completed = "COMPLETED"
    }
    declare enum EventMetadataType {
        Scheduler = "SCHEDULER"
    }
    declare enum EventMetadataTaskType {
        StaticCron = "STATIC_CRON",
        RelativeCron = "RELATIVE_CRON",
        StaticInterval = "STATIC_INTERVAL",
        RelativeInterval = "RELATIVE_INTERVAL"
    }
    declare enum EventMetadataOnMultipleInstances {
        Replace = "REPLACE",
        Create = "CREATE",
        Skip = "SKIP"
    }
    declare enum EventActionOnInactive {
        Skip = "SKIP",
        Error = "ERROR",
        Continue = "CONTINUE"
    }
    interface EventSchedulerCronMetadata {
        cronExpression: string;
    }
    interface EventSchedulerIntervalMetadata {
        interval: number;
    }
    interface EventSchedulerStaticMetadata {
    }
    interface EventSchedulerRelativeMetadata {
        runAfterEvent: Pick<GenericEntity, '_id'>;
    }
    declare interface EventScheduleGenericMetadata {
        type: EventMetadataType.Scheduler;
        retryImmediatelyAfterBoot: boolean;
        recurring: boolean;
        onMultipleInstances: EventMetadataOnMultipleInstances;
    }
    declare interface EventSchedulerRelativeCronMetadata extends EventScheduleGenericMetadata, EventSchedulerCronMetadata, EventSchedulerRelativeMetadata {
        taskType: EventMetadataTaskType.RelativeCron;
    }
    declare interface EventSchedulerRelativeIntervalMetadata extends EventScheduleGenericMetadata, EventSchedulerIntervalMetadata, EventSchedulerRelativeMetadata {
        taskType: EventMetadataTaskType.RelativeInterval;
    }
    declare interface EventSchedulerStaticCronMetadata extends EventScheduleGenericMetadata, EventSchedulerCronMetadata, EventSchedulerStaticMetadata {
        taskType: EventMetadataTaskType.StaticCron;
    }
    declare interface EventSchedulerStaticIntervalMetadata extends EventScheduleGenericMetadata, EventSchedulerIntervalMetadata, EventSchedulerStaticMetadata {
        taskType: EventMetadataTaskType.StaticInterval;
    }
    declare type EventMetadata = EventSchedulerRelativeCronMetadata | EventSchedulerRelativeIntervalMetadata | EventSchedulerStaticCronMetadata | EventSchedulerStaticIntervalMetadata;
    declare interface EventDto {
        displayName: string;
        triggerType: EventTriggerType;
        triggerFilters: Record<string, unknown>;
        conditionDefinition: string;
        actionDefinition: string;
        state: EventState;
        metadata: EventMetadata | null;
    }
    declare type Event = EventDto & GenericEntity;
    declare type EventsSearchQuery = SearchQuery<Event>;
    declare type EventsSearchResponse = SearchResponse<Event>;
    declare interface SensorData extends GenericEntity {
        deviceId: number;
        data: Record<string, unknown>;
    }
    declare enum EventInstanceState {
        UnknownError = "UNKNOWN_ERROR",
        FailedOnCondition = "FAILED_ON_CONDITION",
        FailedOnAction = "FAILED_ON_ACTION",
        Success = "SUCCESS",
        ConditionNotMet = "CONDITION_NOT_MET"
    }
    interface PerformanceMetricsStep {
        name: string;
        executionStartDate: string;
        executionEndDate: string;
        executionDuration: number;
    }
    interface PerformanceMetrics {
        executionStartDate: string;
        executionEndDate: string;
        executionDuration: number;
        steps: PerformanceMetricsStep[];
    }
    declare interface EventInstance extends GenericEntity {
        eventId: number;
        parentEventId: number | null;
        triggerContext: Record<string, unknown>;
        state: EventInstanceState;
        error: unknown;
        performanceMetrics: PerformanceMetrics;
        eventRunId: string;
    }
    declare interface EventRunSummaryChild {
        event: Event;
        parentEvent?: Event;
        eventInstance?: EventInstance;
        children: EventRunSummaryChild[];
    }
    declare interface EventRunSummary {
        children: EventRunSummaryChild[];
    }
    declare type EventsTriggerResponse = {
        runId: string;
        summary: EventRunSummary;
    }[];
    declare type EventTriggerContext = Record<string, unknown>;
    declare interface EventTriggerOptions {
        onInactive?: EventActionOnInactive;
    }
    declare interface EventsTriggerPayload {
        filters: {
            triggerType?: EventTriggerType;
            triggerFilters: Record<string, unknown>;
        };
        context: EventTriggerContext;
        options?: EventTriggerOptions;
    }
    interface EventWithTrigger extends Event {
        trigger: (context?: EventTriggerContext, opts?: EventTriggerOptions) => Promise<void>;
    }
    interface DevicesSdk {
        findByIdOrFail: (id: number) => Promise<Device>;
        createSensorData: (device: Device, data: SensorData['data']) => Promise<void>;
        publishData: (device: Device, data: Record<string, unknown>) => Promise<void>;
    }
    interface EventsSdk {
        findByIdOrFail: (id: number) => Promise<EventWithTrigger>;
    }
    declare var sdk: {
        devices: DevicesSdk;
        events: EventsSdk;
    }
