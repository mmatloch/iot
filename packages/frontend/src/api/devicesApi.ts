import { DevicesSearchQuery, DevicesSearchResponse } from '@definitions/entities/deviceTypes';
import { useFetch } from '@hooks/useFetch';

import { ApiRoute } from '../constants';

export const useDevices = (query: DevicesSearchQuery) =>
    useFetch<DevicesSearchResponse>(
        {
            url: ApiRoute.Devices.Root,
            method: 'GET',
            query,
        },
        {
            keepPreviousData: true,
        },
    );
