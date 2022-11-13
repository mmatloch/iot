import { GenericEntity } from '@definitions/commonTypes';
import { SearchQuery } from '@definitions/searchTypes';
import { omitQueryDefaults, serializeQuery } from '@utils/searchQuery';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useSaveQueryInUrl<TEntity extends GenericEntity>(
    searchQuery: SearchQuery<TEntity>,
    defaultQuery: SearchQuery<TEntity>,
) {
    const [, setSearchParams] = useSearchParams();

    useEffect(() => {
        setSearchParams(serializeQuery(omitQueryDefaults(searchQuery, defaultQuery)));
    }, [defaultQuery, searchQuery, setSearchParams]);
}
