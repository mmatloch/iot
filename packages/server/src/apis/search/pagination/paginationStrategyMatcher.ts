import type { RawSearchQuery } from '../searchQuerySchema';
import { createOffsetPaginationStrategy } from './offsetPaginationStrategy';
import type { PaginationStrategy } from './paginationStrategy';

const STRATEGIES = [createOffsetPaginationStrategy()];

export const matchPaginationStrategy = (
    defaultStrategy: PaginationStrategy,
    rawSearchQuery: RawSearchQuery,
): PaginationStrategy => {
    const matched = STRATEGIES.find((strategy) => strategy.doesQueryMatchStrategy(rawSearchQuery));

    return matched || defaultStrategy;
};
