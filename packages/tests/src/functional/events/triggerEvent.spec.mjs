import { generateEventPostPayload, generateEventTriggerPayload } from '../../dataGenerators/eventsDataGenerators.mjs';
import { createEventHelpers } from '../../helpers/helpers.mjs';

const H = createEventHelpers({
    path: 'events/trigger',
});

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

        it('should receive an error when trying to trigger a event', async () => {
            // given
            const payload = generateEventTriggerPayload();

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

        it('should trigger a event', async () => {
            // given
            const postPayload = generateEventPostPayload();
            const { body: event } = await eventHelpers.post(postPayload).expectSuccess();

            const payload = generateEventTriggerPayload();
            payload.filters.triggerType = event.triggerType;
            payload.filters.triggerFilters = event.triggerFilters;

            // when
            const { body: triggerResult } = await H.post(payload).expectSuccess();

            // then
            expect(triggerResult.processedEvents).toBeArrayOfSize(1);

            const [processedEvent] = triggerResult.processedEvents;

            expect(processedEvent).not.toHaveProperty('triggeredBy');
            expect(processedEvent.event).toStrictEqual(event);
            expect(processedEvent.eventInstance).toMatchObject({
                eventId: event._id,
                triggerContext: payload.context,
                state: 'SUCCESS',
            });
            expect(processedEvent.eventInstance).not.toHaveProperty('triggeredBy');
            expect(processedEvent.processedEvents).toBeArrayOfSize(0);
        });

        it('should trigger a chain of events', async () => {
            // given
            const firstEventPayload = generateEventPostPayload();
            firstEventPayload.actionDefinition = 'return true';

            const { body: firstEvent } = await eventHelpers.post(firstEventPayload).expectSuccess();

            const secondEventPayload = generateEventPostPayload();
            secondEventPayload.actionDefinition = `
                const filters = {_id: ${firstEvent._id}};
                await sdk.eventRunner.trigger({filters, context});
            `;

            const { body: secondEvent } = await eventHelpers.post(secondEventPayload).expectSuccess();

            const payload = generateEventTriggerPayload();
            payload.filters.triggerType = secondEvent.triggerType;
            payload.filters.triggerFilters = secondEvent.triggerFilters;

            // when
            const { body: triggerResult } = await H.post(payload).expectSuccess();

            // then
            expect(triggerResult.processedEvents).toBeArrayOfSize(1);

            const [firstProcessedEvent] = triggerResult.processedEvents;

            expect(firstProcessedEvent.event).toStrictEqual(secondEvent);
            expect(firstProcessedEvent.eventInstance).toMatchObject({
                eventId: secondEvent._id,
                triggerContext: payload.context,
                state: 'SUCCESS',
            });
            expect(firstProcessedEvent.eventInstance).not.toHaveProperty('triggeredBy');
            expect(firstProcessedEvent.processedEvents).toBeArrayOfSize(1);

            const [secondProcessedEvent] = firstProcessedEvent.processedEvents;
            expect(secondProcessedEvent.event).toStrictEqual(firstEvent);
            expect(secondProcessedEvent.eventInstance).toMatchObject({
                eventId: firstEvent._id,
                triggerContext: payload.context,
                state: 'SUCCESS',
                triggeredByEventId: secondEvent._id,
            });
            expect(secondProcessedEvent.processedEvents).toBeArrayOfSize(0);
        });

        it('should return performance measurements for each event instance', async () => {
            // given
            const firstEventPayload = generateEventPostPayload();
            firstEventPayload.actionDefinition = 'return true';

            const { body: firstEvent } = await eventHelpers.post(firstEventPayload).expectSuccess();

            const secondEventPayload = generateEventPostPayload();
            secondEventPayload.actionDefinition = `
                const filters = {_id: ${firstEvent._id}};
                await sdk.eventRunner.trigger({filters, context});
            `;

            const { body: secondEvent } = await eventHelpers.post(secondEventPayload).expectSuccess();

            const thirdEventPayload = generateEventPostPayload();
            thirdEventPayload.actionDefinition = `
                const filters = {_id: ${secondEvent._id}};
                await sdk.eventRunner.trigger({filters, context});
            `;

            const { body: thirdEvent } = await eventHelpers.post(thirdEventPayload).expectSuccess();

            const payload = generateEventTriggerPayload();
            payload.filters.triggerType = thirdEvent.triggerType;
            payload.filters.triggerFilters = thirdEvent.triggerFilters;

            // when
            const { body: triggerResult } = await H.post(payload).expectSuccess();

            // then
            expect(triggerResult.processedEvents).toBeArrayOfSize(1);

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

            const [firstProcessedEvent] = triggerResult.processedEvents;
            expectPerformanceMetrics(firstProcessedEvent);

            const [secondProcessedEvent] = firstProcessedEvent.processedEvents;
            expectPerformanceMetrics(secondProcessedEvent);

            const [thirdProcessedEvent] = secondProcessedEvent.processedEvents;
            expectPerformanceMetrics(thirdProcessedEvent);
        });

        it('should return an empty result when there is no event matching the filters', async () => {
            // given
            const payload = generateEventTriggerPayload();

            // when
            const { body: triggerResult } = await H.post(payload).expectSuccess();

            // then
            expect(triggerResult.processedEvents).toBeArrayOfSize(0);
        });
    });
});
