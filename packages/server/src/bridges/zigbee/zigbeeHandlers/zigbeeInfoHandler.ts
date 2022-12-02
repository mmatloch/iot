import { addSeconds } from 'date-fns';

import type { Configuration} from '../../../entities/configurationEntity';
import { ConfigurationType } from '../../../entities/configurationEntity';
import { getLogger } from '../../../logger';
import { createConfigurationsService } from '../../../services/configurationsService';
import type { ZigbeeInfo } from '../zigbeeDefinitions';
import { getZigbeeInfo, setZigbeeInfo } from '../zigbeeInfo';

const logger = getLogger();

export const onInfoHandler = async (info: ZigbeeInfo) => {
    const oldInfo = getZigbeeInfo();
    setZigbeeInfo(info);

    const service = createConfigurationsService();

    const [configuration] = await service.searchByDataType(ConfigurationType.ZigbeeBridge);

    if (configuration) {
        const payload: Configuration['data'] = {
            ...configuration.data,
            permitDevicesJoin: info.permitJoin,
        };

        const shouldUpdateDates = () => {
            if (!payload.permitDevicesJoin || !info.permitJoinTimeout) {
                return false;
            }

            if (oldInfo?.permitJoinTimeout) {
                // time extension
                if (oldInfo.permitJoinTimeout < info.permitJoinTimeout) {
                    return true;
                }
            }

            // `permitDevicesJoin` is true but has not been changed
            if (payload.permitDevicesJoin === configuration.data.permitDevicesJoin) {
                return false;
            }

            return true;
        };

        if (!payload.permitDevicesJoin) {
            delete payload.permitDevicesJoinStartAt;
            delete payload.permitDevicesJoinEndAt;
        }

        if (info.permitJoinTimeout && shouldUpdateDates()) {
            const now = new Date();
            payload.permitDevicesJoinStartAt = now.toISOString();
            payload.permitDevicesJoinEndAt = addSeconds(now, info.permitJoinTimeout).toISOString();
        }

        await service.update(configuration, {
            data: payload,
        });
    }
};

export const onInfoErrorHandler = async (e: unknown) => {
    logger.error({
        msg: `An error occurred while handling information from the Zigbee bridge`,
        err: e,
    });
};
