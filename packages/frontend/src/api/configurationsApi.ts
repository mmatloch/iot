import { Configuration, ConfigurationDto } from '@definitions/configurationTypes';
import { SearchQuery, SearchResponse } from '@definitions/searchTypes';
import { useFetch } from '@hooks/useFetch';
import { useGenericMutation } from '@hooks/useGenericMutation';
import { UseQueryOptions, useQueryClient } from 'react-query';

import { ApiRoute } from '../constants';

export type ConfigurationsSearchQuery = SearchQuery<Configuration>;
export type ConfigurationsSearchResponse = SearchResponse<Configuration>;

export const useCreateConfiguration = () => {
    const queryClient = useQueryClient();

    return useGenericMutation<Configuration, ConfigurationDto>(
        {
            url: ApiRoute.Configurations.Root,
            method: 'POST',
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries([ApiRoute.Configurations.Root]);
            },
        },
    );
};

export const useConfigurations = (
    query: ConfigurationsSearchQuery,
    useQueryOptions?: UseQueryOptions<ConfigurationsSearchResponse, Error>,
) =>
    useFetch<ConfigurationsSearchResponse>(
        {
            url: ApiRoute.Configurations.Root,
            method: 'GET',
            query,
        },
        {
            keepPreviousData: true,
            ...useQueryOptions,
        },
    );

export const useUpdateConfiguration = (configuration: Configuration) => {
    const queryClient = useQueryClient();

    return useGenericMutation<Configuration, Partial<Configuration>>(
        {
            url: `${ApiRoute.Configurations.Root}/${configuration._id}`,
            method: 'PATCH',
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries([ApiRoute.Configurations.Root]);
            },
        },
    );
};
