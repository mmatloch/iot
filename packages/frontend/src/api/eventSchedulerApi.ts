import {
    EventSchedulerTasksSearchQuery,
    EventSchedulerTasksSearchReponse,
} from '@definitions/entities/eventSchedulerTypes';
import { useFetch } from '@hooks/useFetch';

import { ApiRoute } from '../constants';

export const useEventSchedulerTasks = (query: EventSchedulerTasksSearchQuery) =>
    useFetch<EventSchedulerTasksSearchReponse>(
        {
            url: ApiRoute.EventScheduler.Tasks,
            method: 'GET',
            query,
        },
        {
            keepPreviousData: true,
        },
    );
