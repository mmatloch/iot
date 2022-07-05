import { transformErrorBody } from '@common/application';
import { BaseError } from '@common/errors';
import _ from 'lodash';

import { Event } from '../entities/eventEntity';
import { EventInstanceState } from '../entities/eventInstanceEntity';
import { ErrorCode, Errors, getErrorCode } from '../errors';
import { EventInstancesService } from '../services/eventInstancesService';
import { EventsService } from '../services/eventsService';
import { createEventProcessor } from './eventProcessor';
import { EventRunnerProcessedEvent, EventRunnerSummary, EventRunnerTriggerOptions } from './eventRunnerDefinitions';
import { createProcessedEventsSummary } from './eventRunnerUtils';

export const createEventRunner = (eventsService: EventsService, eventInstancesService: EventInstancesService) => {
    const summary: EventRunnerSummary = {
        processedEvents: [],
    };

    const checkCircularReference = (event: Event) => {
        if (summary.processedEvents.find((e) => e.event._id === event._id)) {
            throw Errors.eventTriggerCircularReference(event._id);
        }
    };

    const runInNewContext = (processedEventsList: EventRunnerProcessedEvent[], triggeredBy?: Event) => {
        const trigger = async ({ filters, context }: EventRunnerTriggerOptions): Promise<void> => {
            const { _hits: events } = await eventsService.search(filters);

            await Promise.all(
                events.map(async (event) => {
                    checkCircularReference(event);

                    const summary = createProcessedEventsSummary(processedEventsList);
                    summary.addEvent(event, triggeredBy);

                    const childProcessedEventsList = summary.findByEvent(event);

                    if (!childProcessedEventsList) {
                        throw new Error(`Event ${event._id} not found in summary`);
                    }

                    const sdk = {
                        eventRunner: {
                            trigger: runInNewContext(childProcessedEventsList.processedEvents, event).trigger,
                        },
                    };

                    try {
                        await createEventProcessor().process(event, sdk, context);
                    } catch (e) {
                        const errorBody = transformErrorBody(e as Error);

                        let eventInstanceState = EventInstanceState.UnknownError;
                        let addError = true;

                        if (e instanceof BaseError) {
                            if (e.errorCode === getErrorCode(ErrorCode.FailedToRunCondition)) {
                                eventInstanceState = EventInstanceState.FailedOnCondition;
                            } else if (e.errorCode === getErrorCode(ErrorCode.FailedToRunAction)) {
                                eventInstanceState = EventInstanceState.FailedOnAction;
                            } else if (e.errorCode === getErrorCode(ErrorCode.ConditionNotMet)) {
                                eventInstanceState = EventInstanceState.ConditionNotMet;
                                addError = false;
                            }
                        }

                        const eventInstance = await eventInstancesService.create({
                            eventId: event._id,
                            triggerContext: context,
                            state: eventInstanceState,
                            error: addError ? errorBody : undefined,
                        });

                        summary.addEventInstance(event, eventInstance);
                        return;
                    }

                    const eventInstance = await eventInstancesService.create({
                        eventId: event._id,
                        triggerContext: context,
                        state: EventInstanceState.Success,
                    });

                    summary.addEventInstance(event, eventInstance);
                }),
            );
        };

        return {
            trigger,
        };
    };

    const trigger = async (opts: EventRunnerTriggerOptions): Promise<EventRunnerSummary> => {
        await runInNewContext(summary.processedEvents).trigger(opts);

        return summary;
    };

    return {
        trigger,
    };
};
