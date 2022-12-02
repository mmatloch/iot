import type { Device, DevicesSearchQuery, DevicesSearchResponse } from '@definitions/entities/deviceTypes';
import { useFetch } from '@hooks/useFetch';
import { useGenericMutation } from '@hooks/useGenericMutation';
import type { UseQueryOptions} from 'react-query';
import { useQueryClient } from 'react-query';

import { ApiRoute } from '../constants';

export const useDevice = (id: number, useQueryOptions?: UseQueryOptions<Device, Error>) =>
    useFetch<Device>(
        {
            url: `${ApiRoute.Devices.Root}/${id}`,
            method: 'GET',
        },
        useQueryOptions,
    );

export const useDevices = (query: DevicesSearchQuery, opts?: UseQueryOptions<DevicesSearchResponse, Error>) =>
    useFetch<DevicesSearchResponse>(
        {
            url: ApiRoute.Devices.Root,
            method: 'GET',
            query,
        },
        {
            ...opts,
            keepPreviousData: true,
        },
    );

export const useUpdateDevice = (device: Device) => {
    const queryClient = useQueryClient();

    const url = `${ApiRoute.Devices.Root}/${device._id}`;

    return useGenericMutation<Device, Partial<Device>>(
        {
            url: url,
            method: 'PATCH',
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries([ApiRoute.Devices.Root]);
                queryClient.invalidateQueries([url]);
            },
        },
    );
};
