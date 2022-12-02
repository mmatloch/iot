import type { GenericEntity } from '@definitions/commonTypes';
import { SEARCH_QUERY_FIELDS } from '@definitions/searchTypes';
import { parseQuery } from '@utils/searchQuery';
import { pick } from 'lodash';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useQueryFromUrl<TEntity extends GenericEntity>() {
    const [searchParams] = useSearchParams();
    const [parsedParams] = useState(() => pick(parseQuery<TEntity>(searchParams.toString()), SEARCH_QUERY_FIELDS));

    return parsedParams;
}
