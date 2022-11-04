import { GenericEntity } from '@definitions/commonTypes';

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
    parentEventId: number | null;
    triggerContext: Record<string, unknown>;
    state: EventInstanceState;
    error: unknown;
    performanceMetrics: PerformanceMetrics;
    eventRunId: string;
}
