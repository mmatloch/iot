import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';

export enum EntitySubscriberEvent {
    AfterInsert = 'AFTER_INSERT',
    AfterUpdate = 'AFTER_UPDATE',
}

export type EntityListenerAfterInsertCallback<T> = (entity: T) => void;
export type EntityListenerAfterUpdateCallback<T> = (entity: T, updatedColumns: ColumnMetadata[]) => void;

export interface CreateEntitySubscriber<TEntity> {
    (event: EntitySubscriberEvent.AfterInsert, cb: EntityListenerAfterInsertCallback<TEntity>): void;
    (event: EntitySubscriberEvent.AfterUpdate, cb: EntityListenerAfterUpdateCallback<TEntity>): void;
}

export type EntityListenerMap<TEntity> = {
    [EntitySubscriberEvent.AfterInsert]: EntityListenerAfterInsertCallback<TEntity>[];
    [EntitySubscriberEvent.AfterUpdate]: EntityListenerAfterUpdateCallback<TEntity>[];
};
