import type { EventInstancesSearchQuery, EventInstancesSearchResponse } from '@definitions/entities/eventInstanceTypes';
import { useFetch } from '@hooks/useFetch';

import { ApiRoute } from '../constants';

export const useEventInstances = (query: EventInstancesSearchQuery) =>
    useFetch<EventInstancesSearchResponse>(
        {
            url: ApiRoute.EventInstances.Root,
            method: 'GET',
            query,
        },
        {
            keepPreviousData: true,
        },
    );
