import type { GenericEntity } from '@definitions/commonTypes';
import type { SearchQuery } from '@definitions/searchTypes';
import { defaults } from 'lodash';
import { useState } from 'react';

import { useDefaultSize } from './useDefaultSize';

export function useDefaultQuery<TEntity extends GenericEntity>(
    defaultQueryOverrides?: SearchQuery<TEntity>,
    loadRelations?: boolean,
) {
    const defaultSize = useDefaultSize();
    const [defaultQuery] = useState(() => {
        const obj: SearchQuery<TEntity> = {
            relations: {
                _createdByUser: true,
                _updatedByUser: true,
            },
            page: 1,
            size: defaultSize,
        };

        if (loadRelations === false) {
            delete obj.relations;
        }

        return defaults(defaultQueryOverrides, obj);
    });

    return defaultQuery;
}
