import type {
    Widget,
    WidgetActionDto,
    WidgetDto,
    WidgetsSearchQuery,
    WidgetsSearchResponse,
} from '@definitions/entities/widgetTypes';
import { useFetch } from '@hooks/useFetch';
import { useGenericMutation } from '@hooks/useGenericMutation';
import type { UseQueryOptions } from 'react-query';
import { useQueryClient } from 'react-query';
import { sleep } from 'react-query/types/core/utils';
import { generatePath } from 'react-router-dom';

import { ApiRoute } from '../constants';

export const useWidget = (id: number, useQueryOptions?: UseQueryOptions<Widget, Error>) =>
    useFetch<Widget>(
        {
            url: `${ApiRoute.Widgets.Root}/${id}`,
            method: 'GET',
        },
        useQueryOptions,
    );

export const useWidgets = (query: WidgetsSearchQuery, opts?: UseQueryOptions<WidgetsSearchResponse, Error>) =>
    useFetch<WidgetsSearchResponse>(
        {
            url: ApiRoute.Widgets.Root,
            method: 'GET',
            query,
        },
        {
            ...opts,
            keepPreviousData: true,
        },
    );

export const useUpdateWidget = (widget: Widget) => {
    const queryClient = useQueryClient();

    const url = `${ApiRoute.Widgets.Root}/${widget._id}`;

    return useGenericMutation<Widget, Partial<Widget>>(
        {
            url: url,
            method: 'PATCH',
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries([ApiRoute.Widgets.Root]);
                queryClient.invalidateQueries([url]);
            },
        },
    );
};

export const useDeleteWidget = (widget: Widget) => {
    const queryClient = useQueryClient();

    const url = `${ApiRoute.Widgets.Root}/${widget._id}`;

    return useGenericMutation<void, void>(
        {
            url: url,
            method: 'DELETE',
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries([ApiRoute.Widgets.Root]);
                queryClient.invalidateQueries([url]);
            },
        },
    );
};

export const useCreateWidget = () => {
    const queryClient = useQueryClient();

    return useGenericMutation<Widget, WidgetDto>(
        {
            url: ApiRoute.Widgets.Root,
            method: 'POST',
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries([ApiRoute.Widgets.Root]);
            },
        },
    );
};

export const usePreviewWidget = (widgetDto: WidgetDto, useQueryOptions?: UseQueryOptions<Widget, Error>) =>
    useFetch<Widget>(
        {
            url: ApiRoute.Widgets.Preview,
            method: 'POST',
            body: widgetDto,
        },
        {
            ...useQueryOptions,
            queryKey: [widgetDto],
            keepPreviousData: true,
        },
    );

export const useWidgetAction = (widget: Widget) => {
    const queryClient = useQueryClient();

    return useGenericMutation<void, WidgetActionDto>(
        {
            url: generatePath(ApiRoute.Widgets.Action, { widgetId: widget._id }),
            method: 'POST',
        },
        {
            onSuccess: async () => {
                await sleep(1000);
                queryClient.invalidateQueries([ApiRoute.Dashboards.Root]);
            },
        },
    );
};
