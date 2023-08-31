import { createEventsService } from '../../services/eventsService';

export const createEventsSdk = () => {
    const eventsService = createEventsService();

    const findByIdOrFail = async (id: number) => {
        const event = await eventsService.findByIdOrFail(id);

        event.trigger = async () => {
            throw Error('Cannot trigger events from the Widgets SDK');
        };

        return event;
    };

    return {
        findByIdOrFail,
    };
};
