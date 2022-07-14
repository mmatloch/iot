import { Device } from '../../../entities/deviceEntity';
import { EventTriggerType } from '../../../entities/eventEntity';
import { createEventRunner } from '../../../events/eventRunner';
import { createEventInstancesService } from '../../../services/eventInstancesService';
import { createEventsService } from '../../../services/eventsService';
import { ZigbeeDeviceData } from '../zigbeeDefinitions';

export const createIncomingDeviceDataHandler = (device: Device) => {
    return async (deviceData: ZigbeeDeviceData) => {
        const eventsService = createEventsService();
        const eventInstancesService = createEventInstancesService();
        const eventRunner = createEventRunner(eventsService, eventInstancesService);

        console.log(
            `Triggering events for device ${device._id} (${device.displayName}) with triggerType ${EventTriggerType.IncomingDeviceData}`,
        );

        const result = await eventRunner.trigger({
            filters: {
                triggerType: EventTriggerType.IncomingDeviceData,
                triggerFilters: {
                    ieeeAddress: device.ieeeAddress,
                },
            },
            context: deviceData,
        });

        console.log(JSON.stringify(result.processedEvents, null, 2));
    };
};

// TODO add logger
export const createIncomingDeviceDataErrorHandler = (device: Device) => {
    return async (error: unknown) => {
        console.log('createIncomingDeviceDataErrorHandler', device, error);
    };
};
