import type { Device} from '@definitions/entities/deviceTypes';
import { DeviceProtocol } from '@definitions/entities/deviceTypes';

import SetupZigbeeDeviceStep from './zigbee/SetupZigbeeDeviceStep';

interface Props {
    device: Device;
}

export default function SetupDeviceStep({ device }: Props) {
    switch (device.protocol) {
        case DeviceProtocol.Virtual: {
            return null;
        }

        case DeviceProtocol.Zigbee: {
            return <SetupZigbeeDeviceStep device={device} />;
        }
    }
}
