import { randomBytes } from 'node:crypto';

import { createMqttClient } from '../clients/mqttClient';
import { getLogger } from '../logger';

const logger = getLogger();

const MQTT_TOPIC_MAP = {
    PermitJoin: {
        request: 'zigbee2mqtt/bridge/request/permit_join',
        response: 'zigbee2mqtt/bridge/response/permit_join',
    },
    BridgeInfo: 'zigbee2mqtt/bridge/info',
};

let currentBridgeInfo: Record<string, unknown> = {
    commit: '3f6a137',
    coordinator: {
        ieee_address: `0x${randomBytes(8).toString('hex')}`,
        meta: {
            maintrel: 1,
            majorrel: 2,
            minorrel: 7,
            product: 1,
            revision: 20210708,
            transportrev: 2,
        },
        type: 'zStack3x0',
    },
    permit_join: false,
    restart_required: false,
    version: '1.25.1',
};

export const createZigbee2mqttService = () => {
    const mqttClient = createMqttClient();
    let permitJoinInterval: undefined | NodeJS.Timeout;

    const initialize = async () => {
        await mqttClient.initialize();

        mqttClient.addHandler(MQTT_TOPIC_MAP.BridgeInfo, bridgeInfoHandler);
        mqttClient.addHandler(MQTT_TOPIC_MAP.PermitJoin.request, permitJoinHandler);
    };

    const startPermitJoinInterval = (time: number) => {
        clearTimeout(permitJoinInterval);

        const timeout = 1000;
        let remainingTime = time * 1000;

        permitJoinInterval = setInterval(async () => {
            remainingTime = remainingTime - timeout;

            if (remainingTime <= 0) {
                await stopPermitJoinInterval();
                return;
            }

            currentBridgeInfo.permit_join = true;
            currentBridgeInfo.permit_join_timeout = remainingTime / 1000;

            await publishBridgeInfo();
        }, timeout);
    };

    const stopPermitJoinInterval = async () => {
        clearTimeout(permitJoinInterval);

        currentBridgeInfo.permit_join = false;
        delete currentBridgeInfo.permit_join_timeout;

        await publishBridgeInfo();
    };

    const permitJoinHandler = async (message: unknown) => {
        const data = JSON.parse(String(message));
        const transaction = data.transaction;
        delete data.transaction;

        const payload = {
            transaction,
            status: 'ok',
            data,
        };

        try {
            await mqttClient.publish(MQTT_TOPIC_MAP.PermitJoin.response, payload);
        } catch (e) {
            logger.error({
                msg: 'Failed to respond to a request for permit to join',
                err: e,
            });
        }

        if (data.value) {
            startPermitJoinInterval(data.time);
        } else {
            stopPermitJoinInterval();
        }
    };

    const bridgeInfoHandler = async (message: unknown) => {
        const data = JSON.parse(String(message));
        currentBridgeInfo = data;
    };

    const publishBridgeInfo = async () => {
        try {
            await mqttClient.publish(MQTT_TOPIC_MAP.BridgeInfo, currentBridgeInfo);
        } catch (e) {
            logger.error({
                msg: 'Failed to publish the bridge info',
                err: e,
            });
        }
    };

    return {
        initialize,
    };
};
