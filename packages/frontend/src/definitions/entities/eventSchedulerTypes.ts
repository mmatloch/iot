import { GenericEntity } from '@definitions/commonTypes';
import { SearchQuery, SearchResponse } from '@definitions/searchTypes';

import type { Event } from './eventTypes';

export enum EventSchedulerTaskState {
    Queued = 'QUEUED',
    Running = 'RUNNING',
}

export interface EventSchedulerTask extends GenericEntity {
    event: Event;
    eventId: number;
    nextRunAt: string;
    state: EventSchedulerTaskState;
}

export type EventSchedulerTasksSearchQuery = SearchQuery<EventSchedulerTask>;
export type EventSchedulerTasksSearchReponse = SearchResponse<EventSchedulerTask>;
