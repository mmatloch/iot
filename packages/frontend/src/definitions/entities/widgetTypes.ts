import { SearchQuery, SearchResponse } from '@definitions/searchTypes';

import type { GenericEntity } from '../commonTypes';

export interface WidgetTextLine {
    deviceId: number | null;
    eventId: number | null;
    value: string;
    id: string;
    styles: Record<string, unknown>;
}

export interface WidgetDto {
    displayName: string;
    icon: string;
    textLines: WidgetTextLine[];
}

export interface Widget extends GenericEntity, WidgetDto {}

export type WidgetsSearchQuery = SearchQuery<Widget>;
export type WidgetsSearchResponse = SearchResponse<Widget>;
