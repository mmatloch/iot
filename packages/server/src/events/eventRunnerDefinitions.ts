import { Event } from '../entities/eventEntity';
import { EventInstance } from '../entities/eventInstanceEntity';

export type EventContext = Record<string, unknown>;
export type EventRunnerCodeSdk = Record<string, unknown>;

export interface EventRunnerTriggerOptions {
    filters: {
        triggerType: Event['triggerType'];
        triggerFilters: Event['triggerFilters'];
    };
    context: EventContext;
}

export interface EventRunnerProcessedEvent {
    event: Event;
    triggeredBy?: Event;
    eventInstance?: EventInstance;
    processedEvents: EventRunnerProcessedEvent[];
}

export interface EventRunnerSummary {
    processedEvents: EventRunnerProcessedEvent[];
}
