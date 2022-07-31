import type { Event } from '../entities/eventEntity';
import type { EventInstance } from '../entities/eventInstanceEntity';
import { Errors } from '../errors';
import { EventRunSummary, EventRunSummaryChild } from './eventRunDefinitions';
import { getChildLocalStorage, getEventRunLocalStorage } from './eventRunLocalStorage';

const findSummaryChild = (event: Event, children: EventRunSummaryChild[]): EventRunSummaryChild | undefined => {
    for (const child of children) {
        if (child.children.length) {
            const foundChild = findSummaryChild(event, child.children);

            if (foundChild) {
                return foundChild;
            }
        }

        if (child.event._id === event._id) {
            return child;
        }
    }
};

const checkCircularReference = (summary: EventRunSummary, event: Event, parentEvent?: Event) => {
    const duplicate = findSummaryChild(event, summary.children);

    if (duplicate) {
        throw Errors.eventTriggerCircularReference(event._id, parentEvent?._id, duplicate.parentEvent?._id);
    }
};

const getCurrentSummary = (
    children: EventRunSummaryChild[],
    parentEvent?: Event,
): EventRunSummaryChild[] | undefined => {
    if (!parentEvent) {
        return children;
    }

    const child = findSummaryChild(parentEvent, children);

    return child?.children;
};

export const getEventRunSummary = (event: Event) => {
    const store = getEventRunLocalStorage().get();

    if (!store) {
        throw new Error(
            `LocalStorage in the event run is empty. This means that the event was probably triggered incorrectly`,
        );
    }

    const childStore = getChildLocalStorage().get();
    const parentEvent = childStore?.parentEvent;

    const { summary } = store;

    checkCircularReference(summary, event, parentEvent);

    const currentSummary = getCurrentSummary(summary.children, parentEvent);

    if (!currentSummary) {
        throw new Error(`No summary was found for the current event`);
    }

    const currentSummaryLength = currentSummary.push({
        event,
        parentEvent,
        children: [],
    });

    const currentSummaryIndex = currentSummaryLength - 1;

    const addEventInstance = (eventInstance: EventInstance) => {
        currentSummary[currentSummaryIndex].eventInstance = eventInstance;
    };

    return {
        runId: store.runId,
        parentEvent: parentEvent,
        addEventInstance,
    };
};
