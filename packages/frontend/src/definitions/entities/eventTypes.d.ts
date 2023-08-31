import type { GenericEntity } from '../commonTypes';
import type { SearchQuery, SearchResponse } from '../searchTypes';
export declare enum EventTriggerType {
    Api = "API",
    IncomingDeviceData = "INCOMING_DEVICE_DATA",
    OutgoingDeviceData = "OUTGOING_DEVICE_DATA",
    Scheduler = "SCHEDULER"
}
export declare enum EventState {
    Active = "ACTIVE",
    Inactive = "INACTIVE",
    Completed = "COMPLETED"
}
export declare enum EventMetadataType {
    Scheduler = "SCHEDULER"
}
export declare enum EventMetadataTaskType {
    StaticCron = "STATIC_CRON",
    RelativeCron = "RELATIVE_CRON",
    StaticInterval = "STATIC_INTERVAL",
    RelativeInterval = "RELATIVE_INTERVAL"
}
export declare enum EventMetadataOnMultipleInstances {
    Replace = "REPLACE",
    Create = "CREATE",
    Skip = "SKIP"
}
export declare enum EventActionOnInactive {
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
export interface EventScheduleGenericMetadata {
    type: EventMetadataType.Scheduler;
    retryImmediatelyAfterBoot: boolean;
    recurring: boolean;
    onMultipleInstances: EventMetadataOnMultipleInstances;
}
export interface EventSchedulerRelativeCronMetadata extends EventScheduleGenericMetadata, EventSchedulerCronMetadata, EventSchedulerRelativeMetadata {
    taskType: EventMetadataTaskType.RelativeCron;
}
export interface EventSchedulerRelativeIntervalMetadata extends EventScheduleGenericMetadata, EventSchedulerIntervalMetadata, EventSchedulerRelativeMetadata {
    taskType: EventMetadataTaskType.RelativeInterval;
}
export interface EventSchedulerStaticCronMetadata extends EventScheduleGenericMetadata, EventSchedulerCronMetadata, EventSchedulerStaticMetadata {
    taskType: EventMetadataTaskType.StaticCron;
}
export interface EventSchedulerStaticIntervalMetadata extends EventScheduleGenericMetadata, EventSchedulerIntervalMetadata, EventSchedulerStaticMetadata {
    taskType: EventMetadataTaskType.StaticInterval;
}
export type EventMetadata = EventSchedulerRelativeCronMetadata | EventSchedulerRelativeIntervalMetadata | EventSchedulerStaticCronMetadata | EventSchedulerStaticIntervalMetadata;
export interface EventDto {
    displayName: string;
    triggerType: EventTriggerType;
    triggerFilters: Record<string, unknown>;
    conditionDefinition: string;
    actionDefinition: string;
    state: EventState;
    metadata: EventMetadata | null;
}
export type Event = EventDto & GenericEntity;
type VirtualSearchFields = 'deviceId';
export type EventsSearchQuery = SearchQuery<Event, VirtualSearchFields>;
export type EventsSearchResponse = SearchResponse<Event>;
export {};
