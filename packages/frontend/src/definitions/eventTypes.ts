import { GenericEntity } from './commonTypes';
import { SearchQuery, SearchResponse } from './searchTypes';
import { User } from './userTypes';

export enum EventTriggerType {
    Api = 'API',
    IncomingDeviceData = 'INCOMING_DEVICE_DATA',
    OutgoingDeviceData = 'OUTGOING_DEVICE_DATA',
    Scheduler = 'SCHEDULER',
}

export enum EventState {
    Active = 'ACTIVE',
    Inactive = 'INACTIVE',
    Completed = 'COMPLETED',
}

export enum EventMetadataType {
    Scheduler = 'SCHEDULER',
}

export enum EventMetadataTaskType {
    StaticCron = 'STATIC_CRON',
    RelativeCron = 'RELATIVE_CRON',
    StaticInterval = 'STATIC_INTERVAL',
    RelativeInterval = 'RELATIVE_INTERVAL',
}

export enum EventMetadataOnMultipleInstances {
    Replace = 'REPLACE',
    Create = 'CREATE',
    Skip = 'SKIP',
}

interface EventSchedulerCronMetadata {
    cronExpression: string;
}

interface EventSchedulerIntervalMetadata {
    interval: number;
}

interface EventSchedulerStaticMetadata {}

interface EventSchedulerRelativeMetadata {
    runAfterEvent: number;
}

export interface EventScheduleGenericMetadata {
    type: EventMetadataType.Scheduler;
    retryImmediatelyAfterBoot: boolean;
    recurring: boolean;
    onMultipleInstances: EventMetadataOnMultipleInstances;
}

export interface EventSchedulerRelativeCronMetadata
    extends EventScheduleGenericMetadata,
        EventSchedulerCronMetadata,
        EventSchedulerRelativeMetadata {
    taskType: EventMetadataTaskType.RelativeCron;
}

export interface EventSchedulerRelativeIntervalMetadata
    extends EventScheduleGenericMetadata,
        EventSchedulerIntervalMetadata,
        EventSchedulerRelativeMetadata {
    taskType: EventMetadataTaskType.RelativeInterval;
}

export interface EventSchedulerStaticCronMetadata
    extends EventScheduleGenericMetadata,
        EventSchedulerCronMetadata,
        EventSchedulerStaticMetadata {
    taskType: EventMetadataTaskType.StaticCron;
}

export interface EventSchedulerStaticIntervalMetadata
    extends EventScheduleGenericMetadata,
        EventSchedulerIntervalMetadata,
        EventSchedulerStaticMetadata {
    taskType: EventMetadataTaskType.StaticInterval;
}

export type EventMetadata =
    | EventSchedulerRelativeCronMetadata
    | EventSchedulerRelativeIntervalMetadata
    | EventSchedulerStaticCronMetadata
    | EventSchedulerStaticIntervalMetadata;

export interface Event extends GenericEntity {
    displayName: string;
    triggerType: EventTriggerType;
    triggerFilters: Record<string, unknown>;
    conditionDefinition: string;
    actionDefinition: string;
    state: EventState;
    metadata: EventMetadata | null;
}

export type EventsSearchQuery = SearchQuery<Event>;
export type EventsSearchResponse = SearchResponse<Event>;
