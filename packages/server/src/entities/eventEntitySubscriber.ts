import type { EntitySubscriberInterface, InsertEvent, UpdateEvent } from 'typeorm';
import { EventSubscriber as OrmEventSubscriber } from 'typeorm';

import { Event } from './eventEntity';
import type { CreateEntitySubscriber, EntityListenerMap} from './subscriberDefinitions';
import { EntitySubscriberEvent } from './subscriberDefinitions';

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
            cb.call(undefined, event.entity as Event, event.databaseEntity, event.updatedColumns),
        );
    }
}

const listenerMap: EntityListenerMap<Event> = {
    [EntitySubscriberEvent.AfterInsert]: [],
    [EntitySubscriberEvent.AfterUpdate]: [],
    [EntitySubscriberEvent.AfterRemove]: [],
};

export const createEventSubscriber: CreateEntitySubscriber<Event> = (event, listenerCb) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listenerMap[event].push(listenerCb as any);
};
