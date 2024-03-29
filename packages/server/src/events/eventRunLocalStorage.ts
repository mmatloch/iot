import { AsyncLocalStorage } from 'async_hooks';

import type { Event } from '../entities/eventEntity';
import type { EventRunStore } from './eventRunDefinitions';

const localStorage = new AsyncLocalStorage<EventRunStore>();

export const getEventRunLocalStorage = () => {
    return {
        get: localStorage.getStore.bind(localStorage),
        run: localStorage.run.bind(localStorage),
    };
};

const childLocalStorage = new AsyncLocalStorage<{
    parentEvent?: Event;
}>();

export const getChildLocalStorage = () => {
    return {
        get: childLocalStorage.getStore.bind(childLocalStorage),
        run: childLocalStorage.run.bind(childLocalStorage),
    };
};
