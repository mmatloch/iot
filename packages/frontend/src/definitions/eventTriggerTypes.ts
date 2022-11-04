import type { EventInstance } from './entities/eventInstanceTypes';
import type { Event, EventActionOnInactive, EventTriggerType } from './entities/eventTypes';

export interface EventRunSummaryChild {
    event: Event;
    parentEvent?: Event;
    eventInstance?: EventInstance;
    children: EventRunSummaryChild[];
}

export interface EventRunSummary {
    children: EventRunSummaryChild[];
}

export type EventsTriggerResponse = {
    runId: string;
    summary: EventRunSummary;
}[];

export interface EventsTriggerPayload {
    filters: {
        triggerType?: EventTriggerType;
        triggerFilters: Record<string, unknown>;
    };
    context: Record<string, unknown>;
    options?: {
        onInactive?: EventActionOnInactive;
    };
}
