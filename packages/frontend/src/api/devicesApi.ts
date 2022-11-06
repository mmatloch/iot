import { Device } from '@definitions/entities/deviceTypes';
import { SearchQuery, SearchResponse } from '@definitions/searchTypes';
import { useFetch } from '@hooks/useFetch';

import { ApiRoute } from '../constants';

export type DevicesSearchQuery = SearchQuery<Device>;
export type DevicesSearchResponse = SearchResponse<Device>;

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
