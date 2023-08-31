import { SearchQuery, SearchResponse } from '@definitions/searchTypes';

import type { GenericEntity } from '../commonTypes';

export interface WidgetTextLine {
    deviceId: number | null;
    eventId: number | null;
    value: string;
    id: string;
    styles: Record<string, unknown>;
}

interface WidgetSwitchAction {
    on: {
        eventId: number | null;
        eventContext: string;
    };
    off: {
        eventId: number | null;
        eventContext: string;
    };
    stateDefinition: string;
}

type WidgetAction = WidgetSwitchAction;

export interface WidgetDto {
    displayName: string;
    icon: string;
    textLines: WidgetTextLine[];
    action: WidgetAction | null;
}

export interface Widget extends GenericEntity, WidgetDto {
    actionState: boolean;
}

export type WidgetsSearchQuery = SearchQuery<Widget>;
export type WidgetsSearchResponse = SearchResponse<Widget>;

export interface WidgetActionDto {
    type: string;
}
