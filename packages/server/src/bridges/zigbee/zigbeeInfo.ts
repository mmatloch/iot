import { ZigbeeInfo } from './zigbeeDefinitions';

let info: ZigbeeInfo | undefined;

export const setZigbeeInfo = (i: ZigbeeInfo) => {
    info = i;
};

export const getZigbeeInfo = () => info;
