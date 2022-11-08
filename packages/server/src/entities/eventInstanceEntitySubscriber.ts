import { EntitySubscriberInterface, InsertEvent, EventSubscriber as OrmEventSubscriber } from 'typeorm';

import { EventInstance } from './eventInstanceEntity';
import { CreateEntitySubscriber, EntityListenerMap, EntitySubscriberEvent } from './subscriberDefinitions';

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
    [EntitySubscriberEvent.AfterRemove]: [],
};

export const createEventInstanceSubscriber: CreateEntitySubscriber<EventInstance> = (event, listenerCb) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listenerMap[event].push(listenerCb as any);
};
