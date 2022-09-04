import { EqualOperator, FindOperator } from 'typeorm';

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

export type SearchFilterOperatorValue = SearchFilterWithFilterOperatorValue & SearchFilterWithLogicalOperatorValue;

export type SortQuery = Record<string, SortValue>;

export type WhereQueryValue = EqualOperator<SimpleFilterValue> | FindOperator<WhereQueryValue>;

export type WhereQuery = Record<string, WhereQueryValue>;

export interface SearchQuery {
    take: number;
    skip?: number;
    order?: SortQuery;
    where?: WhereQuery;
}

export interface SearchResponseMeta {
    totalHits?: number;
    totalPages?: number;
}

export interface SearchResponse<TEntity> {
    _links: {
        next?: string;
        previous?: string;
    };
    _meta: SearchResponseMeta;
    _hits: TEntity[];
}
