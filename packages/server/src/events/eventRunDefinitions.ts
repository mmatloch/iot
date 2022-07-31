import type { Event } from '../entities/eventEntity';
import type { EventInstance } from '../entities/eventInstanceEntity';

export interface EventRunSummaryChild {
    event: Event;
    parentEvent?: Event;
    eventInstance?: EventInstance;
    children: EventRunSummaryChild[];
}

export interface EventRunSummary {
    children: EventRunSummaryChild[];
}

export type EventTriggerContext = Record<string, unknown>;

export interface EventRunStore {
    runId: string;
    summary: EventRunSummary;
}
