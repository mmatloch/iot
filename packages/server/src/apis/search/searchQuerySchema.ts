import { Static, Type } from '@sinclair/typebox';

import { filterOperatorSchema, logicalOperatorSchema, simpleFilterValueSchema } from './filterOperatorSchema';
import { SortValue } from './searchDefinitions';

const filterValueSchema = Type.Union([
    filterOperatorSchema.equal,
    filterOperatorSchema.lowerThan,
    filterOperatorSchema.lowerThanOrEqual,
    filterOperatorSchema.greaterThan,
    filterOperatorSchema.greaterThanOrEqual,
    filterOperatorSchema.like,
    filterOperatorSchema.iLike,
    filterOperatorSchema.in,
    filterOperatorSchema.between,
    filterOperatorSchema.exists,
    filterOperatorSchema.json,

    logicalOperatorSchema.not,

    simpleFilterValueSchema,
]);

export const searchQuerySchema = Type.Object({
    filters: Type.Optional(Type.Record(Type.String(), filterValueSchema)),
    sort: Type.Optional(Type.Record(Type.String(), Type.Enum(SortValue))),
    size: Type.Optional(Type.Integer()),
});

export type RawSearchQuery = Static<typeof searchQuerySchema>;
