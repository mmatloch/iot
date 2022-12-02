import type { SearchQuery } from '@definitions/searchTypes';
import { defaults } from 'lodash';
import { useState } from 'react';

import { DefaultSizeMap, useDefaultSize } from './useDefaultSize';

export interface UseDefaultQueryOptions {
    loadRelations?: boolean;
    defaultSizeMap?: DefaultSizeMap;
}

const SIZE_MAP: DefaultSizeMap = {
    md: 10,
    lg: 9,
};

export function useDefaultQuery<TSearchQuery extends SearchQuery>(
    defaultQueryOverrides?: TSearchQuery,
    opts?: UseDefaultQueryOptions,
) {
    const defaultSize = useDefaultSize(opts?.defaultSizeMap ?? SIZE_MAP);

    const [defaultQuery] = useState<TSearchQuery>(() => {
        const obj = {
            relations: {
                _createdByUser: true,
                _updatedByUser: true,
            },
            page: 1,
            size: defaultSize,
        } as TSearchQuery;

        if (opts?.loadRelations === false) {
            delete obj.relations;
        }

        return defaults(defaultQueryOverrides, obj);
    });

    return defaultQuery;
}
