import { getConfig } from '../config.mjs';

const config = getConfig();

export const getZigbeeTopic = (device) => {
    return {
        toReceiveData: `${config.zigbee.topicPrefix}/${device.ieeeAddress}`,
        toPublishData: `${config.zigbee.topicPrefix}/${device.ieeeAddress}/set`,
    };
};
