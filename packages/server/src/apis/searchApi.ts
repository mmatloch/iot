import type { TSchema} from '@sinclair/typebox';
import { Type } from '@sinclair/typebox';
import type { FindManyOptions } from 'typeorm';

import type { GenericService } from '../services/genericService';
import type { PaginationStrategy } from './search/pagination/paginationStrategy';
import { matchPaginationStrategy } from './search/pagination/paginationStrategyMatcher';
import type { BuildQueryFromRawOptions} from './search/queryBuilder';
import { buildQueryFromRaw } from './search/queryBuilder';
import type { SearchResponse } from './search/searchDefinitions';
import type { RawSearchQuery } from './search/searchQuerySchema';

export const createSearchResponseSchema = (hitSchema: TSchema) => {
    return Type.Object({
        _links: Type.Object({
            next: Type.Optional(Type.String()),
            previous: Type.Optional(Type.String()),
        }),
        _meta: Type.Object({
            totalHits: Type.Optional(Type.Number()),
            totalPages: Type.Optional(Type.Number()),
        }),
        _hits: Type.Array(hitSchema),
    });
};

export interface RestSearchOptions<TEntity> extends BuildQueryFromRawOptions<TEntity> {
    pagination: {
        defaultStrategy: PaginationStrategy;
    };
}

export const createRestSearch = <TEntity, TEntityDto>(
    service: Pick<GenericService<TEntity, TEntityDto>, 'search' | 'searchAndCount'>,
) => {
    const query = async (
        rawSearchQuery: RawSearchQuery,
        opts: RestSearchOptions<TEntity>,
    ): Promise<SearchResponse<TEntity>> => {
        const query = buildQueryFromRaw(rawSearchQuery, opts);

        const paginationStrategy = matchPaginationStrategy(opts.pagination.defaultStrategy, rawSearchQuery);
        paginationStrategy.buildQuery(query, rawSearchQuery);

        const [hits, totalHits] = await service.searchAndCount(query as FindManyOptions<TEntity>);

        const response = {
            _links: {},
            _meta: {
                totalHits,
            },
            _hits: hits,
        };

        paginationStrategy.buildResponse(response, query);

        return response;
    };

    return {
        query,
    };
};

export { searchQuerySchema } from './search/searchQuerySchema';
export { SortValue } from './search/searchDefinitions';
export { createOffsetPaginationStrategy } from './search/pagination/offsetPaginationStrategy';
