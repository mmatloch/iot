import { Type } from '@sinclair/typebox';

import { FilterLogicalOperator, FilterOperator } from './searchDefinitions';

export const simpleFilterValueSchema = Type.Union([Type.String(), Type.Number(), Type.Boolean()]);

export const filterOperatorSchema = {
    equal: Type.Object({
        [FilterOperator.Equal]: simpleFilterValueSchema,
    }),
    lowerThan: Type.Object({
        [FilterOperator.LowerThan]: simpleFilterValueSchema,
    }),
    lowerThanOrEqual: Type.Object({
        [FilterOperator.LowerThanOrEqual]: simpleFilterValueSchema,
    }),
    greaterThan: Type.Object({
        [FilterOperator.GreaterThan]: simpleFilterValueSchema,
    }),
    greaterThanOrEqual: Type.Object({
        [FilterOperator.GreaterThanOrEqual]: simpleFilterValueSchema,
    }),
    between: Type.Object({
        [FilterOperator.Between]: Type.Tuple([simpleFilterValueSchema, simpleFilterValueSchema]),
    }),
    like: Type.Object({
        [FilterOperator.Like]: simpleFilterValueSchema,
    }),
    iLike: Type.Object({
        [FilterOperator.ILike]: simpleFilterValueSchema,
    }),
    exists: Type.Object({
        [FilterOperator.Exists]: Type.Boolean(),
    }),
    in: Type.Object({
        [FilterOperator.In]: Type.Array(simpleFilterValueSchema),
    }),
    json: Type.Object({
        [FilterOperator.Json]: Type.String(),
    }),
};

export const logicalOperatorSchema = {
    not: Type.Object({
        [FilterLogicalOperator.Not]: Type.Union([
            filterOperatorSchema.equal,
            filterOperatorSchema.lowerThan,
            filterOperatorSchema.lowerThanOrEqual,
            filterOperatorSchema.greaterThan,
            filterOperatorSchema.greaterThanOrEqual,
            filterOperatorSchema.between,
            filterOperatorSchema.like,
            filterOperatorSchema.iLike,
            filterOperatorSchema.in,
            filterOperatorSchema.json,

            // no $exists
        ]),
    }),
};
