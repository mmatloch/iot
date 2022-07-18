import { Device } from '../../../entities/deviceEntity';
import { EventTriggerType } from '../../../entities/eventEntity';
import { createEventRunner } from '../../../events/eventRunner';
import { getLogger } from '../../../logger';
import { createEventInstancesService } from '../../../services/eventInstancesService';
import { createEventsService } from '../../../services/eventsService';
import { ZigbeeDeviceData } from '../zigbeeDefinitions';

const logger = getLogger();

export const createIncomingDeviceDataHandler = (device: Device) => {
    return async (deviceData: ZigbeeDeviceData) => {
        const eventsService = createEventsService();
        const eventInstancesService = createEventInstancesService();
        const eventRunner = createEventRunner(eventsService, eventInstancesService);

        await eventRunner.trigger({
            filters: {
                triggerType: EventTriggerType.IncomingDeviceData,
                triggerFilters: {
                    deviceId: device._id,
                },
            },
            context: deviceData,
        });
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
