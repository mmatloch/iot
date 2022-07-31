import { createEventsService } from '../../services/eventsService';

export const createEventsSdk = () => {
    const eventsService = createEventsService();

    const findByIdOrFail = (id: number) => {
        return eventsService.findByIdOrFail(id);
    };

    return {
        findByIdOrFail,
    };
};
