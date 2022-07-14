import { ZigbeeInfo } from '../zigbeeDefinitions';
import { setZigbeeInfo } from '../zigbeeInfo';

export const onInfoHandler = async (info: ZigbeeInfo) => {
    setZigbeeInfo(info);
};

// TODO add logger
export const onInfoErrorHandler = async (error: unknown) => {
    console.log('onInfoErrorHandler', JSON.stringify(error, null, 2));
};
