import { getConfig } from '../config.mjs';
import { createHttpHelpers } from './httpHelpers.mjs';
import { createMqttHelpers } from './mqttHelpers.mjs';

const config = getConfig();

// HTTP API
export const createUserHelpers = (...opts) => createHttpHelpers(config.resources.users, ...opts);
export const createDeviceHelpers = (...opts) => createHttpHelpers(config.resources.devices, ...opts);
export const createEventHelpers = (...opts) => createHttpHelpers(config.resources.events, ...opts);
export const createEventInstanceHelpers = (...opts) => createHttpHelpers(config.resources.eventInstances, ...opts);
export const createGoogleOAuth2AuthorizationCodeHelpers = (...opts) =>
    createHttpHelpers(config.resources.googleOAuth2AuthorizationCode, ...opts);

// MQTT Zigbee
export const createZigbeeBridgeDevicesHelpers = (...opts) =>
    createMqttHelpers(config.zigbee.bridgeDevicesTopic, ...opts);
export const createZigbeeBridgeInfoHelpers = (...opts) => createMqttHelpers(config.zigbee.bridgeInfoTopic, ...opts);

export const createZigbeeHelpers = (topic, ...opts) => createMqttHelpers(topic, ...opts);
