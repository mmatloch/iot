import type {
    EntitySubscriberInterface,
    InsertEvent,
    RemoveEvent,
    UpdateEvent} from 'typeorm';
import {
    EventSubscriber as OrmEventSubscriber
} from 'typeorm';

import { Configuration } from './configurationEntity';
import type { CreateEntitySubscriber, EntityListenerMap} from './subscriberDefinitions';
import { EntitySubscriberEvent } from './subscriberDefinitions';

@OrmEventSubscriber()
export class ConfigurationSubscriber implements EntitySubscriberInterface<Configuration> {
    listenTo() {
        return Configuration;
    }

    afterInsert(event: InsertEvent<Configuration>) {
        listenerMap[EntitySubscriberEvent.AfterInsert].forEach((cb) => cb.call(undefined, event.entity));
    }

    afterUpdate(event: UpdateEvent<Configuration>) {
        listenerMap[EntitySubscriberEvent.AfterUpdate].forEach((cb) =>
            cb.call(undefined, event.entity as Configuration, event.databaseEntity, event.updatedColumns),
        );
    }

    afterRemove(event: RemoveEvent<Configuration>) {
        listenerMap[EntitySubscriberEvent.AfterRemove].forEach((cb) => cb.call(undefined, event.entity));
    }
}

const listenerMap: EntityListenerMap<Configuration> = {
    [EntitySubscriberEvent.AfterInsert]: [],
    [EntitySubscriberEvent.AfterUpdate]: [],
    [EntitySubscriberEvent.AfterRemove]: [],
};

export const createConfigurationSubscriber: CreateEntitySubscriber<Configuration> = (event, listenerCb) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listenerMap[event].push(listenerCb as any);
};
