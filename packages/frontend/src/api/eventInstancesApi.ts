import type {
    EventInstance,
    EventInstancesSearchQuery,
    EventInstancesSearchResponse,
} from '@definitions/entities/eventInstanceTypes';
import { useFetch } from '@hooks/useFetch';
import { UseQueryOptions } from 'react-query';

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

export const useEventInstance = (id: number, useQueryOptions?: UseQueryOptions<EventInstance, Error>) =>
    useFetch<EventInstance>(
        {
            url: `${ApiRoute.EventInstances.Root}/${id}`,
            method: 'GET',
        },
        useQueryOptions,
    );
