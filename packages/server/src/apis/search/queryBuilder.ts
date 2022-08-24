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
} from 'typeorm';

import {
    FilterLogicalOperator,
    FilterOperator,
    SearchFilterWithFilterOperatorValue,
    SearchFilterWithLogicalOperatorValue,
    SearchQuery,
    SimpleFilterValue,
    SortQuery,
    SortValue,
    WhereQueryValue,
} from './searchDefinitions';
import { SearchError } from './searchErrors';
import { RawSearchQuery, searchQuerySchema } from './searchQuerySchema';

const isSimpleValue = (value: unknown): value is SimpleFilterValue => {
    return _.isString(value) || _.isNumber(value) || _.isBoolean(value);
};

type BuildMap = {
    [P in FilterOperator]: (value: NonNullable<SearchFilterWithFilterOperatorValue[P]>) => WhereQueryValue;
};

const buildMap: BuildMap = {
    [FilterOperator.Equal]: Equal,
    [FilterOperator.LowerThan]: LessThan,
    [FilterOperator.LowerThanOrEqual]: LessThanOrEqual,
    [FilterOperator.GreaterThan]: MoreThan,
    [FilterOperator.GreaterThanOrEqual]: MoreThanOrEqual,
    [FilterOperator.Like]: Like,
    [FilterOperator.ILike]: ILike,
    [FilterOperator.In]: In,
    [FilterOperator.Between]: ([from, to]) => Between(from, to),
    [FilterOperator.Exists]: (exists) => (exists ? Not(IsNull()) : IsNull()),
};

const ALLOWED_FIELDS = Object.keys(searchQuerySchema.properties);

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
    };
}

export const buildQueryFromRaw = <TEntity>(
    rawSearchQuery: RawSearchQuery,
    opts: BuildQueryFromRawOptions<TEntity>,
): SearchQuery => {
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

        const buildByOperator = (
            key: string,
            value: SearchFilterWithFilterOperatorValue | SearchFilterWithLogicalOperatorValue,
        ) => {
            Object.entries(buildMap).forEach(([operator, buildWhereOperator]) => {
                const v = _.get(value, operator);

                if (v) {
                    if (operator === FilterLogicalOperator.Not) {
                        where[key] = Not(buildWhereOperator(v));
                    } else {
                        where[key] = buildWhereOperator(v);
                    }
                }
            });
        };

        Object.entries(rawSearchQuery.filters).forEach(([key, value]) => {
            if (!opts.filters.allowedFields.includes(key as keyof TEntity)) {
                throw SearchError.disallowedFiltersField(key);
            }

            if (isSimpleValue(value)) {
                where[key] = Equal(value);
                return;
            }

            buildByOperator(key, value);
        });

        return where;
    };

    const query: SearchQuery = {
        take: rawSearchQuery.size || opts.size.default,
        order: buildOrder(),
        where: buildWhere(),
    };

    return query;
};
