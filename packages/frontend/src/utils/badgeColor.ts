import { EventState } from '@definitions/entities/eventTypes';

export const getEventStateBadgeColor = (state: EventState) => {
    switch (state) {
        case EventState.Active:
            return 'success';
        case EventState.Inactive:
            return 'error';
        case EventState.Completed:
            return 'warning';
        default:
            return 'default';
    }
};
