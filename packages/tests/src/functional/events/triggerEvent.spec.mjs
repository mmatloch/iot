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
            expect(processedEvent.eventInstance).toHaveProperty('eventId', event._id);
            expect(processedEvent.eventInstance).toHaveProperty('triggerContext', payload.context);
            expect(processedEvent.eventInstance).toHaveProperty('state', 'SUCCESS');
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

            expect(firstProcessedEvent).not.toHaveProperty('triggeredBy');
            expect(firstProcessedEvent.event).toStrictEqual(secondEvent);
            expect(firstProcessedEvent.eventInstance).toHaveProperty('eventId', secondEvent._id);
            expect(firstProcessedEvent.eventInstance).toHaveProperty('triggerContext', payload.context);
            expect(firstProcessedEvent.eventInstance).toHaveProperty('state', 'SUCCESS');
            expect(firstProcessedEvent.processedEvents).toBeArrayOfSize(1);

            const [secondProcessedEvent] = firstProcessedEvent.processedEvents;
            expect(secondProcessedEvent).toHaveProperty('triggeredBy', secondEvent);
            expect(secondProcessedEvent.event).toStrictEqual(firstEvent);
            expect(secondProcessedEvent.eventInstance).toHaveProperty('eventId', firstEvent._id);
            expect(secondProcessedEvent.eventInstance).toHaveProperty('triggerContext', payload.context);
            expect(secondProcessedEvent.eventInstance).toHaveProperty('state', 'SUCCESS');
            expect(secondProcessedEvent.processedEvents).toBeArrayOfSize(0);
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
