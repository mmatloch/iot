import type {
    Dashboard,
    DashboardDto,
    DashboardsSearchQuery,
    DashboardsSearchResponse,
    ReorderDashboardsDto,
    ShareDashboardDto,
} from '@definitions/entities/dashboardTypes';
import { useFetch } from '@hooks/useFetch';
import { useGenericMutation } from '@hooks/useGenericMutation';
import type { UseQueryOptions } from 'react-query';
import { useQueryClient } from 'react-query';

import { ApiRoute } from '../constants';

export const useDashboard = (id: number, useQueryOptions?: UseQueryOptions<Dashboard, Error>) =>
    useFetch<Dashboard>(
        {
            url: `${ApiRoute.Dashboards.Root}/${id}`,
            method: 'GET',
        },
        useQueryOptions,
    );

export const useDashboards = (query: DashboardsSearchQuery, opts?: UseQueryOptions<DashboardsSearchResponse, Error>) =>
    useFetch<DashboardsSearchResponse>(
        {
            url: ApiRoute.Dashboards.Root,
            method: 'GET',
            query,
        },
        {
            ...opts,
            keepPreviousData: true,
        },
    );

export const useUpdateDashboard = (dashboard: Dashboard) => {
    const queryClient = useQueryClient();

    const url = `${ApiRoute.Dashboards.Root}/${dashboard._id}`;

    return useGenericMutation<Dashboard, Partial<Dashboard>>(
        {
            url: url,
            method: 'PATCH',
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries([ApiRoute.Dashboards.Root]);
                queryClient.invalidateQueries([url]);
            },
        },
    );
};

export const useDeleteDashboard = (dashboard: Dashboard) => {
    const queryClient = useQueryClient();

    const url = `${ApiRoute.Dashboards.Root}/${dashboard._id}`;

    return useGenericMutation<void, void>(
        {
            url: url,
            method: 'DELETE',
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries([ApiRoute.Dashboards.Root]);
                queryClient.invalidateQueries([url]);
            },
        },
    );
};

export const useCreateDashboard = () => {
    const queryClient = useQueryClient();

    return useGenericMutation<Dashboard, DashboardDto>(
        {
            url: ApiRoute.Dashboards.Root,
            method: 'POST',
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries([ApiRoute.Dashboards.Root]);
            },
        },
    );
};

export const useReorderDashboards = () => {
    const queryClient = useQueryClient();

    return useGenericMutation<Dashboard, ReorderDashboardsDto>(
        {
            url: ApiRoute.Dashboards.Reorder,
            method: 'POST',
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries([ApiRoute.Dashboards.Root]);
            },
        },
    );
};

export const useShareDashboard = (dashboard: Dashboard) => {
    const queryClient = useQueryClient();

    const url = `${ApiRoute.Dashboards.Root}/${dashboard._id}/share`;

    return useGenericMutation<void, ShareDashboardDto>(
        {
            url,
            method: 'POST',
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries([ApiRoute.Dashboards.Root]);
            },
        },
    );
};
