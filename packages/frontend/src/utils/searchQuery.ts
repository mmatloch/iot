import type { SearchQuery } from '@definitions/searchTypes';
import { flatten } from 'flat';
import { cloneDeep, get, isEqual, isUndefined, set, unset } from 'lodash';
import Qs from 'qs';

export const serializeQuery = (query: unknown): string => {
    return Qs.stringify(query, {
        indices: false,
        arrayFormat: 'brackets',
    });
};

export const parseQuery = <TSearchQuery extends SearchQuery>(query: string): TSearchQuery => {
    return Qs.parse(query) as unknown as TSearchQuery;
};

export const omitQueryDefaults = <TSearchQuery extends SearchQuery>(current: TSearchQuery, defaults: TSearchQuery) => {
    const currentClone = cloneDeep(current);
    const flat = flatten<TSearchQuery, Record<string, unknown>>(current);

    Object.entries(flat).forEach(([path, value]) => {
        const defaultValue = get(defaults, path);

        if (isEqual(value, defaultValue)) {
            unset(currentClone, path);
        }
    });

    return currentClone;
};

export const mergeQuery = <TSearchQuery extends SearchQuery>(
    source: TSearchQuery,
    other: TSearchQuery,
): TSearchQuery => {
    const sourceClone = cloneDeep(source);
    const flatOther = flatten<TSearchQuery, Record<string, unknown>>(other);

    Object.entries(flatOther).forEach(([path, value]) => {
        if (isUndefined(value)) {
            unset(sourceClone, path);
        } else {
            set(sourceClone, path, value);
        }
    });

    return sourceClone;
};
