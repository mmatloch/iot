import type { GenericEntity, StructuredError } from '@definitions/commonTypes';
import type { SearchQuery } from '@definitions/searchTypes';

import type { Event } from './eventTypes';

export enum EventInstanceState {
    UnknownError = 'UNKNOWN_ERROR',
    FailedOnCondition = 'FAILED_ON_CONDITION',
    FailedOnAction = 'FAILED_ON_ACTION',
    Success = 'SUCCESS',
    ConditionNotMet = 'CONDITION_NOT_MET',
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

export interface EventInstance extends GenericEntity {
    eventId: number;
    event: Event;
    parentEventId: number | null;
    triggerContext: Record<string, unknown>;
    state: EventInstanceState;
    error: StructuredError;
    performanceMetrics: PerformanceMetrics;
    eventRunId: string;
}

type VirtualSearchFields = 'deviceId';

export interface EventInstancesSearchQuery extends SearchQuery<EventInstance, VirtualSearchFields> {
    cursor?: string;
}

export interface EventInstancesSearchResponse {
    _hits: EventInstance[];
    _meta: {
        nextCursor?: string;
    };
}
