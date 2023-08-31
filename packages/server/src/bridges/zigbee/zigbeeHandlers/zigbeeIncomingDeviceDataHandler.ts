import { EventTriggerType } from '../../../definitions/eventDefinitions';
import type { Device } from '../../../entities/deviceEntity';
import { eventTriggerInNewContext } from '../../../events/eventTriggerInNewContext';
import { getLogger } from '../../../logger';
import { createDevicesService } from '../../../services/devicesService';
import { createEventsService } from '../../../services/eventsService';
import type { ZigbeeDeviceData } from '../zigbeeDefinitions';

const logger = getLogger();

export const createIncomingDeviceDataHandler = (deviceId: number) => {
    return async (deviceData: ZigbeeDeviceData) => {
        const devicesService = createDevicesService();
        const device = await devicesService.findByIdOrFail(deviceId);

        await devicesService.updateFeatures(device, deviceData);

        const eventsService = createEventsService();
        const events = await eventsService.search({
            where: {
                triggerType: EventTriggerType.IncomingDeviceData,
                triggerFilters: {
                    deviceId: device._id,
                },
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
