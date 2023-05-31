import { get, isUndefined, set } from 'lodash';

import type { DeviceFeatureValue } from '../definitions/deviceDefinitions';
import type { Device } from '../entities/deviceEntity';
import type { DeviceFeatureEntry } from '../entities/deviceFeatureEntity';
import { DeviceFeatureType } from '../entities/deviceFeatureEntity';
import { getLogger } from '../logger';

const logger = getLogger();

export type DeviceData = Record<string, unknown>;

interface DeviceFeatureStateChange {
    propertyName: string;
}

const parseFeatureValue = (value: unknown, device: Device, feature: DeviceFeatureEntry): DeviceFeatureValue => {
    switch (feature.type) {
        case DeviceFeatureType.Text:
            return String(value);
        case DeviceFeatureType.Numeric:
            return Number(value);
        case DeviceFeatureType.Binary: {
            const { valueOn, valueOff } = feature;

            if (value !== valueOn && value !== valueOff) {
                logger.error({
                    msg: `The feature value (${value}) doesn't match either valueOn (${valueOn}) or valueOff (${valueOff})`,
                    device,
                });

                return false;
            }

            return value === valueOn;
        }
        case DeviceFeatureType.Enum:
            return value as DeviceFeatureValue;
    }
};

export const getDeviceFeatureState = (device: Device, data: DeviceData) => {
    const featureStateChanges: DeviceFeatureStateChange[] = [];

    const newFeatureState = Object.entries(device.features).reduce((acc, [propertyName, feature]) => {
        const currentValue = get(device.featureState, propertyName);

        const rawValue = get(data, propertyName);

        if (isUndefined(rawValue)) {
            if (!isUndefined(currentValue)) {
                set(acc, propertyName, currentValue);
            }

            return acc;
        }

        const parsedValue = parseFeatureValue(rawValue, device, feature);

        if (currentValue?.value === parsedValue) {
            set(acc, propertyName, currentValue);
        } else {
            featureStateChanges.push({
                propertyName,
            });
            set(acc, propertyName, {
                value: parsedValue,
                updatedAt: new Date().toISOString(),
            });
        }

        return acc;
    }, {} as Device['featureState']);

    return {
        newFeatureState,
        featureStateChanges,
    };
};
