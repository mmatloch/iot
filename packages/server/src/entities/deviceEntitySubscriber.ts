import type { EntitySubscriberInterface, InsertEvent, UpdateEvent } from 'typeorm';
import { EventSubscriber as OrmEventSubscriber } from 'typeorm';

import { Device } from './deviceEntity';
import type { CreateEntitySubscriber, EntityListenerMap } from './subscriberDefinitions';
import { EntitySubscriberEvent } from './subscriberDefinitions';

@OrmEventSubscriber()
export class DeviceSubscriber implements EntitySubscriberInterface<Device> {
    listenTo() {
        return Device;
    }

    afterInsert(event: InsertEvent<Device>) {
        listenerMap[EntitySubscriberEvent.AfterInsert].forEach((cb) => cb.call(undefined, event.entity));
    }

    afterUpdate(event: UpdateEvent<Device>) {
        listenerMap[EntitySubscriberEvent.AfterUpdate].forEach((cb) =>
            cb.call(undefined, event.entity as Device, event.databaseEntity, event.updatedColumns),
        );
    }
}

const listenerMap: EntityListenerMap<Device> = {
    [EntitySubscriberEvent.AfterInsert]: [],
    [EntitySubscriberEvent.AfterUpdate]: [],
    [EntitySubscriberEvent.AfterRemove]: [],
};

export const createDeviceSubscriber: CreateEntitySubscriber<Device> = (event, listenerCb) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listenerMap[event].push(listenerCb as any);
};
