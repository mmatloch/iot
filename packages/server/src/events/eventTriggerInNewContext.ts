import crypto from 'node:crypto';

import type { Event } from '../entities/eventEntity';
import { EventTriggerOptions } from './eventDefinitions';
import { EventRunStore, EventTriggerContext } from './eventRunDefinitions';
import { getEventRunLocalStorage } from './eventRunLocalStorage';

interface Options extends EventTriggerOptions {
    reuseStore?: boolean;
}

export const eventTriggerInNewContext = async (event: Event, context: EventTriggerContext, opts?: Options) => {
    const localStorage = getEventRunLocalStorage();
    const currentStore = localStorage.get();

    let store: EventRunStore;

    if (opts?.reuseStore && currentStore) {
        store = currentStore;
    } else {
        store = {
            runId: crypto.randomUUID(),
            summary: {
                children: [],
            },
        };
    }

    await localStorage.run(store, event.trigger, context, opts);

    return store;
};
