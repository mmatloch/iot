import { getLogger } from '../../../logger';
import { ZigbeeInfo } from '../zigbeeDefinitions';
import { setZigbeeInfo } from '../zigbeeInfo';

const logger = getLogger();

export const onInfoHandler = async (info: ZigbeeInfo) => {
    setZigbeeInfo(info);
};

export const onInfoErrorHandler = async (e: unknown) => {
    logger.error({
        msg: `An error occurred while handling information from the Zigbee bridge`,
        err: e,
    });
};
