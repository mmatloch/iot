import type { Event, EventDto, EventsSearchQuery, EventsSearchResponse } from '@definitions/entities/eventTypes';
import type { EventsTriggerPayload, EventsTriggerResponse } from '@definitions/eventTriggerTypes';
import { useFetch } from '@hooks/useFetch';
import { useGenericMutation } from '@hooks/useGenericMutation';
import isNumber from 'lodash/isNumber';
import type { UseQueryOptions} from 'react-query';
import { useQueryClient } from 'react-query';

import { ApiRoute } from '../constants';

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

export const useCreateEvent = () => {
    const queryClient = useQueryClient();

    return useGenericMutation<Event, EventDto>(
        {
            url: ApiRoute.Events.Root,
            method: 'POST',
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries([ApiRoute.Events.Root]);
            },
        },
    );
};

export const useUpdateEvent = (event: Event | number) => {
    const queryClient = useQueryClient();

    const eventId = isNumber(event) ? event : event._id;
    const url = `${ApiRoute.Events.Root}/${eventId}`;

    return useGenericMutation<Event, Partial<Event>>(
        {
            url: url,
            method: 'PATCH',
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries([ApiRoute.Events.Root]);
                queryClient.invalidateQueries([url]);
            },
        },
    );
};

export const useEvent = (id: number, useQueryOptions?: UseQueryOptions<Event, Error>) =>
    useFetch<Event>(
        {
            url: `${ApiRoute.Events.Root}/${id}`,
            method: 'GET',
        },
        useQueryOptions,
    );

export const useTriggerEvent = () => {
    return useGenericMutation<EventsTriggerResponse, EventsTriggerPayload>({
        url: ApiRoute.Events.Trigger,
        method: 'POST',
    });
};
