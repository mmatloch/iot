import { Event } from '@definitions/eventTypes';
import { SearchQuery, SearchResponse } from '@definitions/searchTypes';
import { useFetch } from '@hooks/useFetch';
import { useGenericMutation } from '@hooks/useGenericMutation';
import { useQueryClient } from 'react-query';

import { ApiRoute } from '../constants';

export type EventsSearchQuery = SearchQuery<Event>;
export type EventsSearchResponse = SearchResponse<Event>;

export const useEvents = (query: EventsSearchQuery) =>
    useFetch<EventsSearchResponse>(
        {
            url: ApiRoute.Events.Root,
            method: 'GET',
            query,
        },
        {
            keepPreviousData: true,
        },
    );

export const useUpdateEvent = (event: Event) => {
    const queryClient = useQueryClient();

    return useGenericMutation<Event, Partial<Event>>(
        {
            url: `${ApiRoute.Events.Root}/${event._id}`,
            method: 'PATCH',
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries([ApiRoute.Events.Root]);
            },
        },
    );
};
