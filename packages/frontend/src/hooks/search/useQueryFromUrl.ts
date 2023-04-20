import { SEARCH_QUERY_FIELDS, SearchQuery } from '@definitions/searchTypes';
import { parseQuery } from '@utils/searchQuery';
import { pick } from 'lodash';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useQueryFromUrl<TSearchQuery extends SearchQuery>() {
    const [searchParams] = useSearchParams();
    const [parsedParams] = useState<TSearchQuery>(
        () => pick(parseQuery<TSearchQuery>(searchParams.toString()), SEARCH_QUERY_FIELDS) as TSearchQuery,
    );

    return parsedParams;
}
