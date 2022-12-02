import type { GenericEntity } from './commonTypes';

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

export enum FilterOperator {
    Equal = '$eq',
    LowerThan = '$lt',
    LowerThanOrEqual = '$lte',
    GreaterThan = '$gt',
    GreaterThanOrEqual = '$gte',
    Between = '$btw',
    Like = '$like',
    ILike = '$iLike',
    Exists = '$exists',
    In = '$in',
    Json = '$json',
}

export enum FilterLogicalOperator {
    Not = '$not',
}

export type SimpleFilterValue = string | number | boolean;

export interface SearchFilterWithFilterOperatorValue {
    [FilterOperator.Equal]?: SimpleFilterValue;
    [FilterOperator.LowerThan]?: SimpleFilterValue;
    [FilterOperator.LowerThanOrEqual]?: SimpleFilterValue;
    [FilterOperator.GreaterThan]?: SimpleFilterValue;
    [FilterOperator.GreaterThanOrEqual]?: SimpleFilterValue;
    [FilterOperator.Like]?: SimpleFilterValue;
    [FilterOperator.ILike]?: SimpleFilterValue;
    [FilterOperator.Exists]?: boolean;
    [FilterOperator.Between]?: [SimpleFilterValue, SimpleFilterValue];
    [FilterOperator.In]?: SimpleFilterValue[];
    [FilterOperator.Json]?: string;
}

export interface SearchFilterWithLogicalOperatorValue {
    [FilterLogicalOperator.Not]?: Omit<SearchFilterWithFilterOperatorValue, FilterOperator.Exists>;
}

export type SearchFilterOperatorValue =
    | SimpleFilterValue
    | (SearchFilterWithFilterOperatorValue & SearchFilterWithLogicalOperatorValue);

export interface SearchQuery<TEntity extends GenericEntity> {
    size?: number;
    page?: number;
    sort?: {
        [key in keyof TEntity]?: SortValue;
    };
    filters?: {
        [key in keyof TEntity]?: SearchFilterOperatorValue;
    };
    relations?: {
        [key in keyof TEntity]?: boolean;
    };
}

export const SEARCH_QUERY_FIELDS = [
    'size',
    'page',
    'sort',
    'filters',
    'relations',
];
