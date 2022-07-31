import { EventTriggerType } from '../../../constants';
import { Device } from '../../../entities/deviceEntity';
import { eventTriggerInNewContext } from '../../../events/eventTriggerInNewContext';
import { getLogger } from '../../../logger';
import { createEventsService } from '../../../services/eventsService';
import { ZigbeeDeviceData } from '../zigbeeDefinitions';

const logger = getLogger();

export const createIncomingDeviceDataHandler = (device: Device) => {
    return async (deviceData: ZigbeeDeviceData) => {
        const eventsService = createEventsService();

        const { _hits: events } = await eventsService.search({
            triggerType: EventTriggerType.IncomingDeviceData,
            triggerFilters: {
                deviceId: device._id,
            },
        });

        await Promise.all(events.map((event) => eventTriggerInNewContext(event, deviceData)));
    };
};

export const createIncomingDeviceDataErrorHandler = (device: Device) => {
    return async (e: unknown) => {
        logger.error({
            msg: `An error occurred while handling incoming Zigbee device data`,
            err: e,
            device,
        });
    };
};
