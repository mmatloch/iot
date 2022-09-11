import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';

export enum EntitySubscriberEvent {
    AfterInsert = 'AFTER_INSERT',
    AfterUpdate = 'AFTER_UPDATE',
    AfterRemove = 'AFTER_REMOVE',
}

export type EntityListenerAfterInsertCallback<T> = (entity: T) => void;
export type EntityListenerAfterUpdateCallback<T> = (entity: T, oldEntity: T, updatedColumns: ColumnMetadata[]) => void;
export type EntityListenerAfterRemoveCallback<T> = (entity?: T) => void;

export interface CreateEntitySubscriber<TEntity> {
    (event: EntitySubscriberEvent.AfterInsert, cb: EntityListenerAfterInsertCallback<TEntity>): void;
    (event: EntitySubscriberEvent.AfterUpdate, cb: EntityListenerAfterUpdateCallback<TEntity>): void;
    (event: EntitySubscriberEvent.AfterRemove, cb: EntityListenerAfterRemoveCallback<TEntity>): void;
}

export type EntityListenerMap<TEntity> = {
    [EntitySubscriberEvent.AfterInsert]: EntityListenerAfterInsertCallback<TEntity>[];
    [EntitySubscriberEvent.AfterUpdate]: EntityListenerAfterUpdateCallback<TEntity>[];
    [EntitySubscriberEvent.AfterRemove]: EntityListenerAfterRemoveCallback<TEntity>[];
};
