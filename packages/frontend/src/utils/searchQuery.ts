import { GenericEntity } from '@definitions/commonTypes';
import { SearchQuery } from '@definitions/searchTypes';
import { flatten } from 'flat';
import cloneDeep from 'lodash/cloneDeep';
import isUndefined from 'lodash/isUndefined';
import set from 'lodash/set';
import unset from 'lodash/unset';
import Qs from 'qs';

export const serializeQuery = (query: unknown): string => {
    return Qs.stringify(query, {
        indices: false,
        arrayFormat: 'brackets',
    });
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
