import _ from 'lodash';

import { ZigbeeInfo } from './zigbeeDefinitions';

let info: ZigbeeInfo | undefined;

export const setZigbeeInfo = (i: ZigbeeInfo) => {
    info = _.cloneDeep(i);
};

export const getZigbeeInfo = () => info;
