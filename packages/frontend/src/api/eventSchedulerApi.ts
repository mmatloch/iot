import type {
    EventSchedulerTask,
    EventSchedulerTasksSearchQuery,
    EventSchedulerTasksSearchReponse,
} from '@definitions/entities/eventSchedulerTypes';
import { useFetch } from '@hooks/useFetch';
import { useGenericMutation } from '@hooks/useGenericMutation';
import { useQueryClient } from 'react-query';

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

export const useDeleteEventSchedulerTask = (task: EventSchedulerTask) => {
    const queryClient = useQueryClient();

    const url = `${ApiRoute.EventScheduler.Tasks}/${task._id}`;

    return useGenericMutation<EventSchedulerTask, void>(
        {
            url: url,
            method: 'DELETE',
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries([ApiRoute.EventScheduler.Tasks]);
                queryClient.invalidateQueries([url]);
            },
        },
    );
};
