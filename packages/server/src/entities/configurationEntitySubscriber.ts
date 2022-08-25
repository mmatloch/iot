import _ from 'lodash';
import {
    EntitySubscriberInterface,
    InsertEvent,
    EventSubscriber as OrmEventSubscriber,
    RemoveEvent,
    UpdateEvent,
} from 'typeorm';

import { Configuration } from './configurationEntity';
import { CreateEntitySubscriber, EntityListenerMap, EntitySubscriberEvent } from './subscriberDefinitions';

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
            cb.call(undefined, event.entity as Configuration, event.updatedColumns),
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
    listenerMap[event].push(listenerCb as any);
};
