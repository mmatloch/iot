import { MqttClient } from '../../clients/mqttClient';
import { ZigbeeBridgeConfiguration } from '../../entities/configurationEntity';
import { DeviceState } from '../../entities/deviceEntity';
import { EventTriggerType } from '../../events/eventDefinitions';
import { eventTriggerInNewContext } from '../../events/eventTriggerInNewContext';
import { getLogger } from '../../logger';
import { createEventsService } from '../../services/eventsService';
import { GenericDataPublisher } from '../generic/genericDataPublisher';
import { ZigbeeErrors } from './zigbeeErrors';

const logger = getLogger();

interface ZigbeeDataPublisher extends GenericDataPublisher {
    initialize: (configuration: ZigbeeBridgeConfiguration) => void;
    finalize: () => void;
}

let dataPublisher: ZigbeeDataPublisher | undefined;

export const createZigbeeDataPublisher = (mqttClient: MqttClient) => {
    let zigbeeBridgeConfiguration: ZigbeeBridgeConfiguration | undefined;

    const initialize: ZigbeeDataPublisher['initialize'] = (configuration) => {
        logger.debug('Initializing Zigbee data publisher');

        zigbeeBridgeConfiguration = configuration;
    };

    const finalize: ZigbeeDataPublisher['finalize'] = () => {
        logger.debug('Finalizing Zigbee data publisher');

        zigbeeBridgeConfiguration = undefined;
    };

    const publishToDevice: ZigbeeDataPublisher['publishToDevice'] = async (device, data) => {
        if (!zigbeeBridgeConfiguration) {
            logger.debug({
                msg: `Ignoring to publish data to the '${device.displayName}' device the Zigbee bridge is disabled`,
                device,
            });

            return;
        }

        if (device.state === DeviceState.Inactive) {
            logger.debug({
                msg: `Ignoring to publish data to the '${device.displayName}' device because it's inactive`,
                device,
            });

            return;
        }

        const topic = `${zigbeeBridgeConfiguration?.topicPrefix}/${device.ieeeAddress}/set`;

        try {
            await mqttClient.publish(topic, data);
        } catch (e) {
            const msg = `Failed to publish data to the '${device.displayName}' device`;

            logger.error({
                msg,
                device,
                err: e,
            });

            throw ZigbeeErrors.failedToPublishData({
                message: msg,
                cause: e as Error,
            });
        }

        const eventsService = createEventsService();
        const events = await eventsService.search({
            where: {
                triggerType: EventTriggerType.OutgoingDeviceData,
                triggerFilters: {
                    deviceId: device._id,
                },
            },
        });

        /**
         * When the server triggers an event as a side effect of running another event,
         * e.g. when sending data to a Zigbee device,
         * we want to use the same "runId" and "summary" initiated at the start of the event run.
         *
         * Using the same summary makes it possible to detect circular references in indirectly related events
         * and better visualize which events were triggered.
         */
        const reuseStore = true;

        await Promise.all(
            events.map((event) =>
                eventTriggerInNewContext(event, data, {
                    reuseStore,
                }),
            ),
        );
    };

    dataPublisher = {
        publishToDevice,
        initialize,
        finalize,
    };

    return dataPublisher;
};

export const getZigbeeDataPublisher = (): ZigbeeDataPublisher => {
    if (!dataPublisher) {
        throw new Error('Zigbee data publisher is not initialized');
    }

    return dataPublisher;
};
