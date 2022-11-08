import { DevicesSearchQuery, DevicesSearchResponse } from '@definitions/entities/deviceTypes';
import { useFetch } from '@hooks/useFetch';
import { UseQueryOptions } from 'react-query';

import { ApiRoute } from '../constants';

export const useDevices = (query: DevicesSearchQuery, opts: UseQueryOptions<DevicesSearchResponse, Error>) =>
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
