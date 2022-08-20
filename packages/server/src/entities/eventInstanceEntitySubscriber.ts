import _ from 'lodash';
import { EntitySubscriberInterface, InsertEvent, EventSubscriber as OrmEventSubscriber, UpdateEvent } from 'typeorm';

import { EventInstance } from './eventInstanceEntity';
import {
    CreateEntitySubscriber,
    EntityListenerAfterInsertCallback,
    EntityListenerMap,
    EntitySubscriberEvent,
} from './subscriberDefinitions';

@OrmEventSubscriber()
export class EventInstanceSubscriber implements EntitySubscriberInterface<EventInstance> {
    listenTo() {
        return EventInstance;
    }

    afterInsert(event: InsertEvent<EventInstance>) {
        listenerMap[EntitySubscriberEvent.AfterInsert].forEach((cb) => cb.call(undefined, event.entity));
    }
}

const listenerMap: EntityListenerMap<EventInstance> = {
    [EntitySubscriberEvent.AfterInsert]: [],
    [EntitySubscriberEvent.AfterUpdate]: [],
};

export const createEventInstanceSubscriber: CreateEntitySubscriber<EventInstance> = (event, listenerCb) => {
    listenerMap[event].push(listenerCb as EntityListenerAfterInsertCallback<EventInstance>);
};
