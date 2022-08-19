import _ from 'lodash';
import { EntitySubscriberInterface, InsertEvent, EventSubscriber as OrmEventSubscriber, UpdateEvent } from 'typeorm';

import { Event } from './eventEntity';
import {
    CreateEntitySubscriber,
    EntityListenerAfterInsertCallback,
    EntityListenerMap,
    EntitySubscriberEvent,
} from './subscriberDefinitions';

@OrmEventSubscriber()
export class EventSubscriber implements EntitySubscriberInterface<Event> {
    listenTo() {
        return Event;
    }

    afterInsert(event: InsertEvent<Event>) {
        listenerMap[EntitySubscriberEvent.AfterInsert].forEach((cb) => cb.call(undefined, event.entity));
    }

    afterUpdate(event: UpdateEvent<Event>) {
        listenerMap[EntitySubscriberEvent.AfterUpdate].forEach((cb) =>
            cb.call(undefined, event.entity as Event, event.updatedColumns),
        );
    }
}

const listenerMap: EntityListenerMap = {
    [EntitySubscriberEvent.AfterInsert]: [],
    [EntitySubscriberEvent.AfterUpdate]: [],
};

export const createEventSubscriber: CreateEntitySubscriber = (event, listenerCb) => {
    listenerMap[event].push(listenerCb as EntityListenerAfterInsertCallback);
};
