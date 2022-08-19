import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';

import type { Event } from './eventEntity';

export enum EntitySubscriberEvent {
    AfterInsert = 'AFTER_INSERT',
    AfterUpdate = 'AFTER_UPDATE',
}

export type EntityListenerAfterInsertCallback = (event: Event) => void;
export type EntityListenerAfterUpdateCallback = (event: Event, updatedColumns: ColumnMetadata[]) => void;

export interface CreateEntitySubscriber {
    (event: EntitySubscriberEvent.AfterInsert, cb: EntityListenerAfterInsertCallback): void;
    (event: EntitySubscriberEvent.AfterUpdate, cb: EntityListenerAfterUpdateCallback): void;
}

export type EntityListenerMap = {
    [EntitySubscriberEvent.AfterInsert]: EntityListenerAfterInsertCallback[];
    [EntitySubscriberEvent.AfterUpdate]: EntityListenerAfterUpdateCallback[];
};
