import { GenericEntity } from '@definitions/commonTypes';
import { SearchQuery } from '@definitions/searchTypes';
import { defaults } from 'lodash';
import { useState } from 'react';

import { useDefaultSize } from './useDefaultSize';

export function useDefaultQuery<TEntity extends GenericEntity>(defaultQueryOverrides?: SearchQuery<TEntity>) {
    const defaultSize = useDefaultSize();
    const [defaultQuery] = useState(
        defaults(defaultQueryOverrides, {
            relations: {
                _createdByUser: true,
                _updatedByUser: true,
            },
            page: 1,
            size: defaultSize,
        }),
    );

    return defaultQuery;
}
