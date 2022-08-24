import { TSchema, Type } from '@sinclair/typebox';
import { FindManyOptions } from 'typeorm';

import { GenericService } from '../services/genericService';
import { BuildQueryFromRawOptions, buildQueryFromRaw } from './search/queryBuilder';
import { RawSearchQuery } from './search/searchQuerySchema';

export const createSearchResponseSchema = (hitSchema: TSchema) => {
    return Type.Object({
        _links: Type.Object({
            next: Type.Optional(Type.String()),
            previous: Type.Optional(Type.String()),
        }),
        _meta: Type.Object({
            totalHits: Type.Optional(Type.Number()),
        }),
        _hits: Type.Array(hitSchema),
    });
};

export interface SearchResponse<TEntity> {
    _links: {
        next?: string;
        previous?: string;
    };
    _meta: {
        totalHits?: number;
    };
    _hits: TEntity[];
}

export interface RestSearchOptions<TEntity> extends BuildQueryFromRawOptions<TEntity> {}

export const createRestSearch = <TEntity, TEntityDto>(
    service: Pick<GenericService<TEntity, TEntityDto>, 'search' | 'searchAndCount'>,
) => {
    const query = async (
        rawSearchQuery: RawSearchQuery,
        opts: RestSearchOptions<TEntity>,
    ): Promise<SearchResponse<TEntity>> => {
        const query = buildQueryFromRaw(rawSearchQuery, opts);

        const [hits, totalHits] = await service.searchAndCount(query as FindManyOptions<TEntity>);

        return {
            _links: {},
            _meta: {
                totalHits,
            },
            _hits: hits,
        };
    };

    return {
        query,
    };
};

export { searchQuerySchema } from './search/searchQuerySchema';
export { SortValue } from './search/searchDefinitions';
