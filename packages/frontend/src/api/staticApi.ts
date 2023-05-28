import { useFetch } from '@hooks/useFetch';

import { ApiRoute } from '../constants';

interface StaticSearchResponse {
    dirs: string[];
    files: string[];
}

export const useStatic = () =>
    useFetch<StaticSearchResponse>(
        {
            url: ApiRoute.Static.Root,
            method: 'GET',
        },
        {
            keepPreviousData: true,
        },
    );
