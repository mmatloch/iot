import { BaseError } from '@common/errors';

enum ZigbeeErrorCode {
    FailedToPublishData = 1,
}

const prefix = 'ZIGBEE';

const getZigbeeErrorCode = (errorCode: ZigbeeErrorCode) => `${prefix}-${errorCode}`;

export const ZigbeeErrors = {
    failedToPublishData: (opts: Partial<BaseError>): BaseError =>
        new BaseError({
            ...opts,
            errorCode: getZigbeeErrorCode(ZigbeeErrorCode.FailedToPublishData),
        }),
};
