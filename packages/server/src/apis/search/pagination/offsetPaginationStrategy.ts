import _ from 'lodash';

import { PaginationStrategy } from './paginationStrategy';

const DEFAULT_PAGE = 1;

interface OffsetPaginationStrategy extends PaginationStrategy {}

export const createOffsetPaginationStrategy = (): OffsetPaginationStrategy => {
    const doesQueryMatchStrategy: OffsetPaginationStrategy['doesQueryMatchStrategy'] = (rawSearchQuery) => {
        return !_.isUndefined(rawSearchQuery.page);
    };

    const buildQuery: OffsetPaginationStrategy['buildQuery'] = (searchQuery, rawSearchQuery) => {
        const page = rawSearchQuery.page ?? DEFAULT_PAGE;
        const offset = searchQuery.take * page - searchQuery.take;

        searchQuery['skip'] = offset;
    };

    const buildResponse: OffsetPaginationStrategy['buildResponse'] = (searchResponse, searchQuery) => {
        const { totalHits } = searchResponse._meta;
        if (!totalHits) {
            return;
        }

        searchResponse._meta.totalPages = Math.ceil(totalHits / searchQuery.take);
    };

    return {
        doesQueryMatchStrategy,
        buildQuery,
        buildResponse,
    };
};
