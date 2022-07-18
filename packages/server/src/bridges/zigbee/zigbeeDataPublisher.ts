import { MqttClient } from '../../clients/mqttClient';
import { DeviceState } from '../../entities/deviceEntity';
import { EventTriggerType } from '../../entities/eventEntity';
import { createEventRunner } from '../../events/eventRunner';
import { getLogger } from '../../logger';
import { createEventInstancesService } from '../../services/eventInstancesService';
import { createEventsService } from '../../services/eventsService';
import { GenericDataPublisher } from '../generic/genericDataPublisher';
import { ZIGBEE_TOPIC_PREFIX } from './zigbeeDefinitions';
import { ZigbeeErrors } from './zigbeeErrors';

const logger = getLogger();

interface ZigbeeDataPublisher extends GenericDataPublisher {}

let dataPublisher: ZigbeeDataPublisher | undefined;

export const createZigbeeDataPublisher = (mqttClient: MqttClient) => {
    const publish: ZigbeeDataPublisher['publish'] = async (device, data) => {
        if (device.state === DeviceState.Inactive) {
            logger.debug({
                msg: `Ignoring to publish data to the '${device.displayName}' device because it's inactive`,
                device,
            });

            return;
        }

        const topic = `${ZIGBEE_TOPIC_PREFIX}/${device.ieeeAddress}/set`;

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

        const eventRunner = createEventRunner(createEventsService(), createEventInstancesService());
        await eventRunner.trigger({
            filters: {
                triggerType: EventTriggerType.OutgoingDeviceData,
                triggerFilters: {
                    deviceId: device._id,
                },
            },
            context: data,
        });
    };

    dataPublisher = {
        publish,
    };
};

export const getZigbeeDataPublisher = (): ZigbeeDataPublisher => {
    if (!dataPublisher) {
        throw new Error('Zigbee data publisher is not initialized');
    }

    return dataPublisher;
};
