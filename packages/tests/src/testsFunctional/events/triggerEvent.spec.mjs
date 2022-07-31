import { generateEventPostPayload, generateEventTriggerPayload } from '../../dataGenerators/eventsDataGenerators.mjs';
import { createEventHelpers, createEventTriggerHelpers } from '../../helpers/helpers.mjs';

const H = createEventTriggerHelpers();

const eventHelpers = createEventHelpers();

/**
 * @group events/triggerEvent
 */

describe('Events triggerEvent', () => {
    describe('as USER', () => {
        beforeAll(() => {
            H.authorizeHttpClient({
                role: 'USER',
            });
        });

        it(`should return an error when trying to trigger an event with triggerType other than 'API'`, async () => {
            // given
            const payload = generateEventTriggerPayload();
            payload.filters.triggerType = 'INCOMING_DEVICE_DATA';

            // when & then
            await H.post(payload).expectForbidden({
                errorCode: 'SRV-3',
            });
        });
    });

    describe('as ADMIN', () => {
        beforeAll(() => {
            H.authorizeHttpClient();
            eventHelpers.authorizeHttpClient();
        });

        it('should trigger an event', async () => {
            // given
            const postPayload = generateEventPostPayload();
            const { body: event } = await eventHelpers.post(postPayload).expectSuccess();

            const payload = generateEventTriggerPayload();
            payload.filters.triggerType = event.triggerType;
            payload.filters.triggerFilters = event.triggerFilters;

            // when
            const { body: triggerResult } = await H.post(payload).expectSuccess();

            // then
            expect(triggerResult).toBeArrayOfSize(1);
            const [{ summary, runId }] = triggerResult;

            expect(summary.children).toBeArrayOfSize(1);
            const [processedEvent] = summary.children;

            expect(processedEvent).not.toHaveProperty('parentEvent');
            expect(processedEvent.event).toStrictEqual(event);
            expect(processedEvent.eventInstance).toMatchObject({
                eventId: event._id,
                eventRunId: runId,
                triggerContext: payload.context,
                state: 'SUCCESS',
                parentEventId: null,
            });
            expect(processedEvent.children).toBeArrayOfSize(0);
        });

        it('should trigger a chain of events', async () => {
            // given
            const firstEventPayload = generateEventPostPayload();
            firstEventPayload.actionDefinition = 'return true';

            const { body: firstEvent } = await eventHelpers.post(firstEventPayload).expectSuccess();

            const secondEventPayload = generateEventPostPayload();
            secondEventPayload.actionDefinition = `
                const event = await sdk.events.findByIdOrFail(${firstEvent._id})
                await event.trigger(context);
            `;

            const { body: secondEvent } = await eventHelpers.post(secondEventPayload).expectSuccess();

            const payload = generateEventTriggerPayload();
            payload.filters.triggerType = secondEvent.triggerType;
            payload.filters.triggerFilters = secondEvent.triggerFilters;

            // when
            const { body: triggerResult } = await H.post(payload).expectSuccess();

            // then
            expect(triggerResult).toBeArrayOfSize(1);
            const [{ summary, runId }] = triggerResult;

            expect(summary.children).toBeArrayOfSize(1);
            const [firstProcessedEvent] = summary.children;

            expect(firstProcessedEvent).not.toHaveProperty('parentEvent');
            expect(firstProcessedEvent.event).toStrictEqual(secondEvent);
            expect(firstProcessedEvent.eventInstance).toMatchObject({
                eventId: secondEvent._id,
                eventRunId: runId,
                triggerContext: payload.context,
                state: 'SUCCESS',
                parentEventId: null,
            });

            expect(firstProcessedEvent.children).toBeArrayOfSize(1);
            const [secondProcessedEvent] = firstProcessedEvent.children;

            expect(secondProcessedEvent.event).toStrictEqual(firstEvent);
            expect(secondProcessedEvent.parentEvent).toStrictEqual(secondEvent);
            expect(secondProcessedEvent.eventInstance).toMatchObject({
                eventId: firstEvent._id,
                eventRunId: runId,
                triggerContext: payload.context,
                state: 'SUCCESS',
                parentEventId: secondEvent._id,
            });
            expect(secondProcessedEvent.children).toBeArrayOfSize(0);
        });

        it('should return performance measurements for each event instance', async () => {
            // given
            const firstEventPayload = generateEventPostPayload();
            firstEventPayload.actionDefinition = 'return true';

            const { body: firstEvent } = await eventHelpers.post(firstEventPayload).expectSuccess();

            const secondEventPayload = generateEventPostPayload();
            secondEventPayload.actionDefinition = `
                const event = await sdk.events.findByIdOrFail(${firstEvent._id})
                await event.trigger(context);
            `;

            const { body: secondEvent } = await eventHelpers.post(secondEventPayload).expectSuccess();

            const thirdEventPayload = generateEventPostPayload();
            thirdEventPayload.actionDefinition = `
                const event = await sdk.events.findByIdOrFail(${secondEvent._id})
                await event.trigger(context);
            `;

            const { body: thirdEvent } = await eventHelpers.post(thirdEventPayload).expectSuccess();

            const payload = generateEventTriggerPayload();
            payload.filters.triggerType = thirdEvent.triggerType;
            payload.filters.triggerFilters = thirdEvent.triggerFilters;

            // when
            const { body: triggerResult } = await H.post(payload).expectSuccess();

            // then
            expect(triggerResult).toBeArrayOfSize(1);
            const [{ summary }] = triggerResult;

            expect(summary.children).toBeArrayOfSize(1);

            const expectPerformanceMetrics = (processedEvent) => {
                expect(processedEvent.eventInstance).toHaveProperty('performanceMetrics');
                expect(processedEvent.eventInstance.performanceMetrics).toContainKeys([
                    'executionStartDate',
                    'executionEndDate',
                    'executionDuration',
                    'steps',
                ]);

                expect(processedEvent.eventInstance.performanceMetrics.steps).toBeArrayOfSize(2);
                const [firstStep, secondStep] = processedEvent.eventInstance.performanceMetrics.steps;

                expect(firstStep).toHaveProperty('name', 'runCondition');
                expect(secondStep).toHaveProperty('name', 'runAction');

                expect(firstStep).toContainKeys(['executionStartDate', 'executionEndDate', 'executionDuration']);
                expect(secondStep).toContainKeys(['executionStartDate', 'executionEndDate', 'executionDuration']);
            };

            const [firstProcessedEvent] = summary.children;
            expectPerformanceMetrics(firstProcessedEvent);

            const [secondProcessedEvent] = firstProcessedEvent.children;
            expectPerformanceMetrics(secondProcessedEvent);

            const [thirdProcessedEvent] = secondProcessedEvent.children;
            expectPerformanceMetrics(thirdProcessedEvent);
        });

        it(`should trigger an event with triggerType other than 'API'`, async () => {
            // given
            const postPayload = generateEventPostPayload();
            postPayload.triggerType === 'INCOMING_DEVICE_DATA';

            const { body: event } = await eventHelpers.post(postPayload).expectSuccess();

            const payload = generateEventTriggerPayload();
            payload.filters.triggerType = event.triggerType;
            payload.filters.triggerFilters = event.triggerFilters;

            // when
            const { body: triggerResult } = await H.post(payload).expectSuccess();

            // then
            expect(triggerResult).toBeArrayOfSize(1);
            const [{ summary }] = triggerResult;

            expect(summary.children).toBeArrayOfSize(1);
        });

        describe('circular reference', () => {
            it('should detect a circular reference in the current event run', async () => {
                // given
                const firstEventPayload = generateEventPostPayload();
                const { body: firstEvent } = await eventHelpers.post(firstEventPayload).expectSuccess();

                const secondEventPayload = generateEventPostPayload();
                secondEventPayload.actionDefinition = `
                    const event = await sdk.events.findByIdOrFail(${firstEvent._id})
                    await event.trigger(context);
                `;

                const { body: secondEvent } = await eventHelpers.post(secondEventPayload).expectSuccess();

                const eventUpdatePayload = {
                    actionDefinition: `
                        const event = await sdk.events.findByIdOrFail(${secondEvent._id})
                        await event.trigger(context);
                    `,
                };

                await eventHelpers.patchById(firstEvent._id, eventUpdatePayload).expectSuccess();

                const payload = generateEventTriggerPayload();
                payload.filters.triggerType = secondEvent.triggerType;
                payload.filters.triggerFilters = secondEvent.triggerFilters;

                // when
                const { body: triggerResult } = await H.post(payload).expectSuccess();

                // then
                expect(triggerResult).toBeArrayOfSize(1);
                const [{ summary }] = triggerResult;

                expect(summary.children).toBeArrayOfSize(1);
                const [firstProcessedEvent] = summary.children;

                expect(firstProcessedEvent.eventInstance).toMatchObject({
                    eventId: secondEvent._id,
                    state: 'SUCCESS',
                });
                expect(firstProcessedEvent.children).toBeArrayOfSize(1);

                const [secondProcessedEvent] = firstProcessedEvent.children;
                expect(secondProcessedEvent.eventInstance).toHaveProperty('state', 'FAILED_ON_ACTION');
                expect(secondProcessedEvent.eventInstance).toHaveProperty('error');
                expect(secondProcessedEvent.eventInstance.error).toMatchObject({
                    message: `Error occurred during the '${firstEvent.displayName}' event action`,
                    errorCode: 'SRV-9',
                });
                expect(secondProcessedEvent.eventInstance.error.cause).toMatchObject({
                    detail: `Detected that event ${secondEvent._id}, triggered by event ${firstEvent._id} is trying to run again in the same event chain. This is regarded as undesirable because it can lead to an infinite loop`,
                    message: 'Circular reference in the event trigger chain',
                    errorCode: 'SRV-11',
                });
            });

            it('should detect a circular reference when the event tries to trigger itself', async () => {
                // given
                const eventPayload = generateEventPostPayload();
                const { body: event } = await eventHelpers.post(eventPayload).expectSuccess();

                const eventUpdatePayload = {
                    actionDefinition: `
                        const event = await sdk.events.findByIdOrFail(${event._id})
                        await event.trigger(context);
                    `,
                };

                await eventHelpers.patchById(event._id, eventUpdatePayload).expectSuccess();

                const payload = generateEventTriggerPayload();
                payload.filters.triggerType = event.triggerType;
                payload.filters.triggerFilters = event.triggerFilters;

                // when
                const { body: triggerResult } = await H.post(payload).expectSuccess();

                // then
                expect(triggerResult).toBeArrayOfSize(1);
                const [{ summary }] = triggerResult;

                expect(summary.children).toBeArrayOfSize(1);
                const [processedEvent] = summary.children;

                expect(processedEvent.eventInstance).toHaveProperty('state', 'FAILED_ON_ACTION');
                expect(processedEvent.eventInstance).toHaveProperty('error');
                expect(processedEvent.eventInstance.error).toMatchObject({
                    message: `Error occurred during the '${event.displayName}' event action`,
                    errorCode: 'SRV-9',
                });
                expect(processedEvent.eventInstance.error.cause).toMatchObject({
                    detail: `Detected that event ${event._id}, triggered by event ${event._id} is trying to run again in the same event chain. This is regarded as undesirable because it can lead to an infinite loop`,
                    message: 'Circular reference in the event trigger chain',
                    errorCode: 'SRV-11',
                });
            });
        });

        it('should return an empty result when there is no event matching the filters', async () => {
            // given
            const payload = generateEventTriggerPayload();

            // when
            const { body: triggerResult } = await H.post(payload).expectSuccess();

            // then
            expect(triggerResult).toBeArrayOfSize(0);
        });
    });
});
