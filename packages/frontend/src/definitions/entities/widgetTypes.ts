import { SearchQuery, SearchResponse } from '@definitions/searchTypes';

import type { GenericEntity } from '../commonTypes';

export interface WidgetDto {
    displayName: string;
    icon: string;
}

export interface Widget extends GenericEntity, WidgetDto {}

export type WidgetsSearchQuery = SearchQuery<Widget>;
export type WidgetsSearchResponse = SearchResponse<Widget>;
