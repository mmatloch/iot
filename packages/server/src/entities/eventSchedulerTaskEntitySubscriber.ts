import type { EntitySubscriberInterface, InsertEvent, RemoveEvent } from 'typeorm';
import { EventSubscriber as OrmEventSubscriber } from 'typeorm';

import { EventSchedulerTask } from './eventSchedulerTaskEntity';
import type { CreateEntitySubscriber, EntityListenerMap} from './subscriberDefinitions';
import { EntitySubscriberEvent } from './subscriberDefinitions';

@OrmEventSubscriber()
export class EventSchedulerTaskSubscriber implements EntitySubscriberInterface<EventSchedulerTask> {
    listenTo() {
        return EventSchedulerTask;
    }

    afterInsert(event: InsertEvent<EventSchedulerTask>) {
        listenerMap[EntitySubscriberEvent.AfterInsert].forEach((cb) => cb.call(undefined, event.entity));
    }

    afterRemove(event: RemoveEvent<EventSchedulerTask>) {
        listenerMap[EntitySubscriberEvent.AfterRemove].forEach((cb) => cb.call(undefined, event.entity));
    }
}

const listenerMap: EntityListenerMap<EventSchedulerTask> = {
    [EntitySubscriberEvent.AfterInsert]: [],
    [EntitySubscriberEvent.AfterUpdate]: [],
    [EntitySubscriberEvent.AfterRemove]: [],
};

export const createEventSchedulerTaskSubscriber: CreateEntitySubscriber<EventSchedulerTask> = (event, listenerCb) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listenerMap[event].push(listenerCb as any);
};
