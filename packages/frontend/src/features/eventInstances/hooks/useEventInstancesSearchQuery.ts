import type { EventInstancesSearchQuery } from '@definitions/entities/eventInstanceTypes';
import { mergeQuery, parseQuery } from '@utils/searchQuery';
import { isUndefined, pick } from 'lodash';
import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useSaveQueryInUrl } from '../../../hooks/search/useSaveQueryInUrl';
import { useDefaultSize } from '../../../hooks/search/useDefaultSize';

const QUERY_FIELDS = ['size', 'filters'];

interface Props {
    defaultSizeMap: {
        md: number;
        lg: number;
    };
}

export type SetEventInstancesSearchQuery = (updatedQuery: EventInstancesSearchQuery | undefined) => void;

export function useEventInstancesSearchQuery({ defaultSizeMap }: Props) {
    const [searchParams] = useSearchParams();
    const defaultSize = useDefaultSize(defaultSizeMap);

    const [defaultQuery] = useState<EventInstancesSearchQuery>(() => ({
        size: defaultSize,
    }));

    const [queryFromUrl] = useState<EventInstancesSearchQuery>(
        () => pick(parseQuery<EventInstancesSearchQuery>(searchParams.toString()), QUERY_FIELDS) as EventInstancesSearchQuery,
    );

    const [searchQuery, setSearchQuery] = useState<EventInstancesSearchQuery>(() => mergeQuery(defaultQuery, queryFromUrl));

    useSaveQueryInUrl(searchQuery, defaultQuery);

    const setSearchQueryWithMerge = useCallback<SetEventInstancesSearchQuery>(
        (updatedQuery) => {
            if (isUndefined(updatedQuery)) {
                setSearchQuery(defaultQuery);
                return;
            }

            setSearchQuery((currentSearchQuery) => mergeQuery(currentSearchQuery, updatedQuery));
        },
        [defaultQuery],
    );

    return {
        searchQuery,
        setSearchQuery: setSearchQueryWithMerge,
    };
}
