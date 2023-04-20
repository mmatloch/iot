import { BaseError, transformErrorBody } from '@common/errors';

import type { PerformanceMetrics } from '../definitions';
import type { EventTriggerOptions } from '../definitions/eventDefinitions';
import { EventActionOnInactive, EventState } from '../definitions/eventDefinitions';
import { EventInstanceState } from '../definitions/eventInstanceDefinitions';
import type { Event } from '../entities/eventEntity';
import { ErrorCode, Errors, getErrorCode } from '../errors';
import { createEventProcessor } from '../events/eventProcessor';
import { getEventRunSummary } from '../events/eventRunSummary';
import { getLogger } from '../logger';
import { createEventInstancesService } from '../services/eventInstancesService';
import type { EventTriggerContext } from './eventRunDefinitions';
import { getChildLocalStorage } from './eventRunLocalStorage';
import { createEventRunSdk } from './sdks/sdk';

export const eventTrigger = async (event: Event, context: EventTriggerContext, opts: EventTriggerOptions = {}) => {
    const logger = getLogger().child({ event });

    const optsWithDefaults = {
        onInactive: EventActionOnInactive.Error,
        ...opts,
    };

    if (event.state === EventState.Inactive) {
        switch (optsWithDefaults.onInactive) {
            case EventActionOnInactive.Error: {
                throw Errors.failedToTriggerEvent(event.displayName, {
                    detail: 'The event is inactive',
                });
            }
            case EventActionOnInactive.Skip: {
                logger.debug(`Skipping the event trigger because the event is inactive`);
                return;
            }
            default:
                break;
        }
    }

    logger.debug(`Triggering the '${event.displayName}' event`);

    const eventProcessor = createEventProcessor(createEventRunSdk());

    const summary = getEventRunSummary(event);

    const performanceMetrics: PerformanceMetrics = {
        executionStartDate: new Date().toISOString(),
        executionEndDate: '',
        executionDuration: 0,
        steps: [],
    };

    const processStart = performance.now();

    const endPerformanceMetrics = () => {
        performanceMetrics.executionEndDate = new Date().toISOString();
        performanceMetrics.executionDuration = performance.now() - processStart;
    };

    try {
        await getChildLocalStorage().run({ parentEvent: event }, () => {
            return eventProcessor.process({
                event,
                context,
                performanceMetrics,
            });
        });

        endPerformanceMetrics();

        logger.debug({
            msg: `Successfully processed the '${
                event.displayName
            }' event. It took ${performanceMetrics.executionDuration.toFixed(2)} ms`,
        });
    } catch (e) {
        endPerformanceMetrics();

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

        if (addError) {
            logger.warn({
                msg: `An error occurred while processing the '${
                    event.displayName
                }' event. It took ${performanceMetrics.executionDuration.toFixed(2)} ms`,
                err: e,
            });
        }

        const eventInstance = await createEventInstancesService().create({
            event,
            eventId: event._id,
            parentEventId: summary.parentEvent?._id || null,
            triggerContext: context,
            state: eventInstanceState,
            error: addError ? errorBody : undefined,
            eventRunId: summary.runId,
            performanceMetrics,
        });

        summary.addEventInstance(eventInstance);
        return;
    }

    const eventInstance = await createEventInstancesService().create({
        event,
        eventId: event._id,
        parentEventId: summary.parentEvent?._id || null,
        triggerContext: context,
        state: EventInstanceState.Success,
        eventRunId: summary.runId,
        performanceMetrics,
    });

    summary.addEventInstance(eventInstance);
};
