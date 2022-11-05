import type { EventInstance } from './entities/eventInstanceTypes';
import type { Event, EventActionOnInactive, EventTriggerType } from './entities/eventTypes';

export interface EventRunSummaryChild {
    event: Event;
    parentEvent?: Event;
    eventInstance: EventInstance;
    children: EventRunSummaryChild[];
}

export interface EventRunSummary {
    children: EventRunSummaryChild[];
}

export type EventsTriggerResponse = {
    runId: string;
    summary: EventRunSummary;
}[];

export type EventTriggerContext = Record<string, unknown>;
export interface EventTriggerOptions {
    onInactive?: EventActionOnInactive;
}

export interface EventsTriggerPayload {
    filters: {
        triggerType?: EventTriggerType;
        triggerFilters: Record<string, unknown>;
    };
    context: EventTriggerContext;
    options?: EventTriggerOptions;
}
