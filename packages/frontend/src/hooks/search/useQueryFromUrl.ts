import { GenericEntity } from '@definitions/commonTypes';
import { parseQuery } from '@utils/searchQuery';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useQueryFromUrl<TEntity extends GenericEntity>() {
    const [searchParams] = useSearchParams();
    const [parsedParams] = useState(() => parseQuery<TEntity>(searchParams.toString()));

    return parsedParams;
}
