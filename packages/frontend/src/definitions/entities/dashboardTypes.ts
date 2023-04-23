import { SearchQuery, SearchResponse } from '@definitions/searchTypes';

import type { GenericEntity } from '../commonTypes';

export interface DashboardLayout {
    widgetId: number;
    width: number;
    height: number;
    positionX: number;
    positionY: number;
}

export interface Dashboard extends GenericEntity {
    userId: string;
    displayName: string;
    index: number;
    layout: DashboardLayout[];
}

export interface DashboardDto {
    displayName: string;
    index: number;
    layout: DashboardLayout[];
}

export type DashboardsSearchQuery = SearchQuery<Dashboard>;
export type DashboardsSearchResponse = SearchResponse<Dashboard>;
