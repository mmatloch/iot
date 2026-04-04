import _ from 'lodash';

import { generateEventPostPayload, generateEventTriggerPayload } from '../../dataGenerators/eventsDataGenerators.mjs';
import { createEventHelpers, createEventInstanceHelpers, createEventTriggerHelpers } from '../../helpers/helpers.mjs';

const eventHelpers = createEventHelpers();
const eventInstanceHelpers = createEventInstanceHelpers();
const eventTriggerHelpers = createEventTriggerHelpers();

/**
 * @group events/searchEventInstances
 */

describe('Events searchEventInstances', () => {
    beforeAll(() => {
        eventHelpers.authorizeHttpClient();
        eventInstanceHelpers.authorizeHttpClient();
        eventTriggerHelpers.authorizeHttpClient();
    });

    it('should paginate event instances with a cursor instead of an exact count', async () => {
        // given
        const eventPayload = generateEventPostPayload();
        const { body: event } = await eventHelpers.post(eventPayload).expectSuccess();

        const triggerPayload = generateEventTriggerPayload();
        triggerPayload.filters.triggerType = event.triggerType;
        triggerPayload.filters.triggerFilters = event.triggerFilters;

        await Promise.all(_.times(12, () => eventTriggerHelpers.post(triggerPayload).expectSuccess()));

        // when
        const { body: firstPage } = await eventInstanceHelpers
            .search({
                size: 5,
                filters: {
                    eventId: event._id,
                },
            })
            .expectSuccess();

        // then
        expect(firstPage._hits).toBeArrayOfSize(5);
        expect(firstPage._meta.nextCursor).toEqual(expect.any(String));
        expect(firstPage._meta.totalHits).toBeUndefined();

        const firstPageIds = firstPage._hits.map(({ _id }) => _id);

        const { body: secondPage } = await eventInstanceHelpers
            .search({
                size: 5,
                filters: {
                    eventId: event._id,
                },
                cursor: firstPage._meta.nextCursor,
            })
            .expectSuccess();

        expect(secondPage._hits).toBeArrayOfSize(5);
        expect(secondPage._meta.nextCursor).toEqual(expect.any(String));

        const secondPageIds = secondPage._hits.map(({ _id }) => _id);
        expect(_.intersection(secondPageIds, firstPageIds)).toBeArrayOfSize(0);

        const { body: thirdPage } = await eventInstanceHelpers
            .search({
                size: 5,
                filters: {
                    eventId: event._id,
                },
                cursor: secondPage._meta.nextCursor,
            })
            .expectSuccess();

        expect(thirdPage._hits).toBeArrayOfSize(2);
        expect(thirdPage._meta.nextCursor).toBeUndefined();
    });
});
