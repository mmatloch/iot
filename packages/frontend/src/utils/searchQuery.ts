import { GenericEntity } from '@definitions/commonTypes';
import { SearchQuery } from '@definitions/searchTypes';
import { flatten } from 'flat';
import { cloneDeep, get, isEqual, isUndefined, set, unset } from 'lodash';
import Qs from 'qs';

export const serializeQuery = (query: unknown): string => {
    return Qs.stringify(query, {
        indices: false,
        arrayFormat: 'brackets',
    });
};

export const parseQuery = <T extends GenericEntity>(query: string): SearchQuery<T> => {
    return Qs.parse(query);
};

export const omitQueryDefaults = <T extends GenericEntity>(current: SearchQuery<T>, defaults: SearchQuery<T>) => {
    const currentClone = cloneDeep(current);
    const flat = flatten<SearchQuery<T>, Record<string, unknown>>(current);

    Object.entries(flat).forEach(([path, value]) => {
        const defaultValue = get(defaults, path);

        if (isEqual(value, defaultValue)) {
            unset(currentClone, path);
        }
    });

    return currentClone;
};

export const mergeQuery = <T extends GenericEntity>(source: SearchQuery<T>, other: SearchQuery<T>): SearchQuery<T> => {
    const sourceClone = cloneDeep(source);
    const flatOther = flatten<SearchQuery<T>, Record<string, unknown>>(other);

    Object.entries(flatOther).forEach(([path, value]) => {
        if (isUndefined(value)) {
            unset(sourceClone, path);
        } else {
            set(sourceClone, path, value);
        }
    });

    return sourceClone;
};
