import _ from 'lodash';

import { Event } from '../entities/eventEntity';
import { EventInstance } from '../entities/eventInstanceEntity';
import { EventRunnerProcessedEvent } from './eventRunnerDefinitions';

export const createProcessedEventsSummary = (processedEventsList: EventRunnerProcessedEvent[]) => {
    const findByEvent = (event: Event): EventRunnerProcessedEvent | undefined => {
        return processedEventsList.find((e) => e.event._id === event._id);
    };

    const addEvent = (event: Event) => {
        processedEventsList.push({
            event,
            processedEvents: [],
        });
    };

    const addEventInstance = (event: Event, eventInstance: EventInstance) => {
        const processedEvent = findByEvent(event);

        if (processedEvent) {
            processedEvent.eventInstance = eventInstance;
        }
    };

    return {
        addEvent,
        addEventInstance,
        findByEvent,
    };
};
