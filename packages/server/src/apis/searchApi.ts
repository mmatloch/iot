import { TSchema, Type } from '@sinclair/typebox';

export const createSearchResponseSchema = (hitSchema: TSchema) => {
    return Type.Object({
        _links: Type.Object({
            next: Type.Optional(Type.String()),
            previous: Type.Optional(Type.String()),
        }),
        _meta: Type.Object({
            totalHits: Type.Number(),
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
        totalHits: number;
    };
    _hits: TEntity[];
}

interface CreateSearchResponseOptions<TEntity> {
    links: {
        next?: string;
        previous?: string;
    };
    meta: {
        totalHits: number;
    };
    hits: TEntity[];
}

export const createSearchResponse = <TEntity>({
    hits,
    links,
    meta,
}: CreateSearchResponseOptions<TEntity>): SearchResponse<TEntity> => {
    return {
        _links: links,
        _meta: meta,
        _hits: hits,
    };
};
