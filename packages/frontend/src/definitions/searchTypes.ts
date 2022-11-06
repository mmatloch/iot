import { GenericEntity } from './commonTypes';

export interface SearchResponse<TEntity extends GenericEntity> {
    _hits: TEntity[];
    _meta: {
        totalHits: number;
        totalPages?: number;
    };
}

export enum SortValue {
    Asc = 'ASC',
    Desc = 'DESC',
}

export interface SearchQuery<TEntity extends GenericEntity> extends Record<string, unknown> {
    size?: number;
    page?: number;
    sort?: {
        [key in keyof TEntity]?: SortValue;
    };
    relations?: {
        [key in keyof TEntity]?: boolean;
    };
}
