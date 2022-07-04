import { transformError } from '@common/application/src/errorTransformer';
import _ from 'lodash';

import { Event } from '../entities/eventEntity';
import { EventInstance, EventInstanceState } from '../entities/eventInstance';
import { Errors } from '../errors';
import { createSandbox } from '../sandbox';
import { EventInstancesService } from '../services/eventInstancesService';
import { EventsService } from '../services/eventsService';

type Context = Record<string, unknown>;

interface EventRunnerTriggerOptions {
    filters: {
        triggerType: Event['triggerType'];
        triggerFilters: Event['triggerFilters'];
    };
    context: Context;
}

interface TriggerProcessedEvents extends Pick<Event, '_id'> {
    triggeredBy?: number;
    eventInstance: Pick<EventInstance, '_id' | 'state' | 'error'>;
}

interface EventRunnerSummary {
    processedEvents: TriggerProcessedEvents[];
}

const sandbox = createSandbox();

export const createEventRunner = (eventsService: EventsService, eventInstancesService: EventInstancesService) => {
    const summary: EventRunnerSummary = {
        processedEvents: [],
    };

    const addToSummary = (event: Event, eventInstance: EventInstance) => {
        let triggeredBy: number | undefined = undefined;

        if (summary.processedEvents.length > 0) {
            triggeredBy = _.last(summary.processedEvents)?._id;
        }

        summary.processedEvents.push({
            _id: event._id,
            triggeredBy,
            eventInstance: {
                _id: eventInstance._id,
                state: eventInstance.state,
                error: eventInstance.error,
            },
        });
    };

    const runCode = (code: string, context: Context): Promise<unknown> => {
        const sdk = {
            eventRunner: {
                trigger,
            },
        };

        return sandbox.run(`(async function(sdk, context) {${code}})`).call(undefined, sdk, context);
    };

    const checkCircularReference = (event: Event) => {
        if (summary.processedEvents.find((e) => e._id === event._id)) {
            throw Errors.eventTriggerCircularReference(event._id);
        }
    };

    const processEvent = async (event: Event, context: Context) => {
        let condition: unknown;
        try {
            condition = await runCode(event.conditionDefinition, context);
        } catch (e) {
            const error = Errors.failedToRunCondition({
                cause: e,
            });

            const eventInstance = await eventInstancesService.create({
                eventId: event._id,
                triggerContext: context,
                state: EventInstanceState.FailedOnCondition,
                error: transformError(error).body,
            });

            addToSummary(event, eventInstance);
            return;
        }

        if (!condition) {
            const eventInstance = await eventInstancesService.create({
                eventId: event._id,
                triggerContext: context,
                state: EventInstanceState.ConditionNotMet,
            });

            addToSummary(event, eventInstance);
            return;
        }

        try {
            await runCode(event.actionDefinition, context);
        } catch (e) {
            const error = Errors.failedToRunAction({
                cause: e,
            });

            const eventInstance = await eventInstancesService.create({
                eventId: event._id,
                triggerContext: context,
                state: EventInstanceState.FailedOnAction,
                error: transformError(error).body,
            });

            addToSummary(event, eventInstance);
            return;
        }

        const eventInstance = await eventInstancesService.create({
            eventId: event._id,
            triggerContext: context,
            state: EventInstanceState.Success,
        });

        addToSummary(event, eventInstance);
    };

    const trigger = async ({ filters, context }: EventRunnerTriggerOptions): Promise<EventRunnerSummary> => {
        const { _hits: events } = await eventsService.search(filters);

        for (const event of events) {
            checkCircularReference(event);
            await processEvent(event, context);
        }

        return summary;
    };

    return {
        trigger,
    };
};
