import { transformErrorBody } from '@common/application';
import { BaseError } from '@common/errors';
import _ from 'lodash';

import { Event } from '../entities/eventEntity';
import { EventInstance, EventInstanceState } from '../entities/eventInstanceEntity';
import { ErrorCode, Errors, getErrorCode } from '../errors';
import { createDevicesService } from '../services/devicesService';
import { EventInstancesService } from '../services/eventInstancesService';
import { EventsService } from '../services/eventsService';
import { createEventProcessor } from './eventProcessor';
import { EventRunnerProcessedEvent, EventRunnerSummary, EventRunnerTriggerOptions } from './eventRunnerDefinitions';
import { createProcessedEventsSummary } from './eventRunnerUtils';
import { createDevicesSdk } from './sdks/devicesSdk';

export const createEventRunner = (eventsService: EventsService, eventInstancesService: EventInstancesService) => {
    const runnerSummary: EventRunnerSummary = {
        processedEvents: [],
    };

    const findEventDuplicate = (
        processedEventsList: EventRunnerProcessedEvent[],
        event: Event,
    ): EventRunnerProcessedEvent | undefined => {
        for (const e of processedEventsList) {
            if (e.processedEvents && e.processedEvents.length) {
                const duplicate = findEventDuplicate(e.processedEvents, event);

                if (duplicate) {
                    return duplicate;
                }
            }

            if (e.event._id === event._id) {
                return e;
            }
        }
    };

    const checkCircularReference = (event: Event, triggeredBy?: Event) => {
        const duplicate = findEventDuplicate(runnerSummary.processedEvents, event);

        if (duplicate) {
            throw Errors.eventTriggerCircularReference(event._id, triggeredBy?._id, duplicate.triggeredBy?._id);
        }
    };

    const runInNewContext = (processedEventsList: EventRunnerProcessedEvent[], triggeredBy?: Event) => {
        const trigger = async ({ filters, context }: EventRunnerTriggerOptions): Promise<void> => {
            const { _hits: events } = await eventsService.search(filters);

            await Promise.all(
                events.map(async (event) => {
                    checkCircularReference(event, triggeredBy);

                    const summary = createProcessedEventsSummary(processedEventsList);
                    summary.addEvent(event);

                    const childProcessedEventsList = summary.findByEvent(event);

                    if (!childProcessedEventsList) {
                        throw new Error(`Event ${event._id} not found in summary`);
                    }

                    const sdk = {
                        eventRunner: {
                            trigger: runInNewContext(childProcessedEventsList.processedEvents, event).trigger,
                        },
                        devices: createDevicesSdk(),
                    };

                    const performanceMetrics: EventInstance['performanceMetrics'] = {
                        executionStartDate: new Date().toISOString(),
                        executionEndDate: '',
                        executionDuration: 0,
                        steps: [],
                    };

                    const processStart = performance.now();

                    try {
                        await createEventProcessor(sdk).process({ event, context, performanceMetrics });
                        performanceMetrics.executionEndDate = new Date().toISOString();
                        performanceMetrics.executionDuration = performance.now() - processStart;
                    } catch (e) {
                        performanceMetrics.executionEndDate = new Date().toISOString();
                        performanceMetrics.executionDuration = performance.now() - processStart;

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
                            triggeredByEventId: triggeredBy?._id,
                            performanceMetrics,
                        });

                        summary.addEventInstance(event, eventInstance);
                        return;
                    }

                    const eventInstance = await eventInstancesService.create({
                        eventId: event._id,
                        triggerContext: context,
                        state: EventInstanceState.Success,
                        triggeredByEventId: triggeredBy?._id,
                        performanceMetrics,
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
        await runInNewContext(runnerSummary.processedEvents).trigger(opts);

        return runnerSummary;
    };

    return {
        trigger,
    };
};
