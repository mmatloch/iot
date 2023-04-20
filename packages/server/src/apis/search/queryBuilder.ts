import _ from 'lodash';
import {
    Between,
    Equal,
    ILike,
    In,
    IsNull,
    LessThan,
    LessThanOrEqual,
    Like,
    MoreThan,
    MoreThanOrEqual,
    Not,
    Raw,
} from 'typeorm';

import type {
    SearchFilterOperatorValue,
    SearchFilterWithFilterOperatorValue,
    SearchQuery,
    SimpleFilterValue,
    SortQuery,
    SortValue,
    WhereQueryValue,
} from './searchDefinitions';
import { FilterLogicalOperator, FilterOperator } from './searchDefinitions';
import { SearchError } from './searchErrors';
import type { RawSearchQuery } from './searchQuerySchema';
import { searchQuerySchema } from './searchQuerySchema';

const isSimpleValue = (value: unknown): value is SimpleFilterValue => {
    return _.isString(value) || _.isNumber(value) || _.isBoolean(value);
};

type BuildMap = {
    [P in FilterOperator]: (value: NonNullable<SearchFilterWithFilterOperatorValue[P]>) => WhereQueryValue;
};

const buildMap: BuildMap = {
    [FilterOperator.Equal]: (v) => Equal(v),
    [FilterOperator.LowerThan]: (v) => LessThan(v),
    [FilterOperator.LowerThanOrEqual]: (v) => LessThanOrEqual(v),
    [FilterOperator.GreaterThan]: (v) => MoreThan(v),
    [FilterOperator.GreaterThanOrEqual]: (v) => MoreThanOrEqual(v),
    [FilterOperator.Like]: (v) => Like(v),
    [FilterOperator.ILike]: (v) => ILike(v),
    [FilterOperator.In]: (v) => In(v),
    [FilterOperator.Between]: ([from, to]) => Between(from, to),
    [FilterOperator.Exists]: (exists) => (exists ? Not(IsNull()) : IsNull()),
    [FilterOperator.Json]: (value) => Raw((alias) => `${alias} @> :value`, { value }),
};

const ALLOWED_FIELDS = Object.keys(searchQuerySchema.properties);

interface VirtualField {
    sourceField: string;
    mapQuery: (value: SimpleFilterValue) => RawSearchQuery['filters'];
}

export interface BuildQueryFromRawOptions<TEntity> {
    size: {
        default: number;
    };
    sort: {
        allowedFields: (keyof TEntity)[];
        default: {
            [P in keyof TEntity]?: SortValue;
        };
    };
    filters: {
        allowedFields: (keyof TEntity)[];
        virtualFields?: VirtualField[];
    };
    relations: {
        allowedFields: (keyof TEntity)[];
    };
}

export const buildQueryFromRaw = <TEntity>(
    rawSearchQuery: RawSearchQuery,
    opts: BuildQueryFromRawOptions<TEntity>,
): SearchQuery => {
    const processVirtualFields = () => {
        if (!opts.filters.virtualFields) {
            return;
        }

        opts.filters.virtualFields.forEach(({ sourceField, mapQuery }) => {
            const sourceValue = rawSearchQuery.filters?.[sourceField];

            if (_.isUndefined(sourceValue)) {
                return;
            }

            if (!isSimpleValue(sourceValue)) {
                throw SearchError.invalidFieldValue(sourceField);
            }

            delete rawSearchQuery.filters?.[sourceField];
            _.merge(rawSearchQuery.filters, mapQuery(sourceValue));
        });
    };

    processVirtualFields();

    const queryKeys = Object.keys(rawSearchQuery);

    queryKeys.forEach((key) => {
        if (!ALLOWED_FIELDS.includes(key)) {
            throw SearchError.disallowedField(key);
        }
    });

    const buildOrder = (): SearchQuery['order'] => {
        if (!rawSearchQuery.sort) {
            return opts.sort.default as SortQuery;
        }

        Object.keys(rawSearchQuery.sort).forEach((key) => {
            if (!opts.sort.allowedFields.includes(key as keyof TEntity)) {
                throw SearchError.disallowedSortField(key);
            }
        });

        return rawSearchQuery.sort as SearchQuery['order'];
    };

    const buildWhere = (): SearchQuery['where'] => {
        if (!rawSearchQuery.filters) {
            return;
        }

        const where: SearchQuery['where'] = {};

        const buildByOperator = (field: string, filterValue: SearchFilterOperatorValue) => {
            (Object.keys(filterValue) as (keyof SearchFilterOperatorValue)[]).forEach((operator) => {
                if (operator === FilterLogicalOperator.Not) {
                    const notFilterValue = filterValue[operator];
                    if (notFilterValue) {
                        buildByOperator(field, notFilterValue);
                        where[field] = Not(where[field]);
                    }

                    return;
                }

                const operatorValue = filterValue[operator];

                if (!_.isUndefined(operatorValue)) {
                    const buildWhereOperator = buildMap[operator];

                    // @ts-expect-error type mismatch
                    where[field] = buildWhereOperator(operatorValue);
                }
            });
        };

        Object.entries(rawSearchQuery.filters).forEach(([field, filterValue]) => {
            if (!opts.filters.allowedFields.includes(field as keyof TEntity)) {
                throw SearchError.disallowedFiltersField(field);
            }

            if (isSimpleValue(filterValue)) {
                where[field] = Equal(filterValue);
                return;
            }

            buildByOperator(field, filterValue);
        });

        return where;
    };

    const buildRelations = (): SearchQuery['relations'] => {
        if (!rawSearchQuery.relations) {
            return;
        }

        Object.keys(rawSearchQuery.relations).forEach((key) => {
            if (!opts.relations.allowedFields.includes(key as keyof TEntity)) {
                throw SearchError.disallowedRelationsField(key);
            }
        });

        return rawSearchQuery.relations;
    };

    const query: SearchQuery = {
        take: rawSearchQuery.size || opts.size.default,
        order: buildOrder(),
        where: buildWhere(),
        relations: buildRelations(),
    };

    return query;
};
