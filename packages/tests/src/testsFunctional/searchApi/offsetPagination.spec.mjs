import _ from 'lodash';

import { generateEventPostPayload } from '../../dataGenerators/eventsDataGenerators.mjs';
import { createEventHelpers } from '../../helpers/helpers.mjs';

const H = createEventHelpers();

/**
 * @group searchApi/offsetPagination
 */

describe('Search API offset pagination', () => {
    beforeAll(async () => {
        H.authorizeHttpClient();

        await Promise.all(_.times(10, () => H.post(generateEventPostPayload()).expectSuccess()));
    });

    it('should return a page count', async () => {
        // given
        const searchQuery = {
            page: 1,
            size: 2,
        };

        // when
        const { body } = await H.search(searchQuery).expectSuccess();

        // then
        const expectedTotalPages = Math.ceil(body._meta.totalHits / searchQuery.size);
        expect(body._meta.totalPages).toBe(expectedTotalPages);
    });
});
