import type { Device} from '@definitions/entities/deviceTypes';
import { DeviceProtocol } from '@definitions/entities/deviceTypes';

import AddZigbeeDeviceStep from './zigbee/AddZigbeeDeviceStep';

interface Props {
    deviceProtocol: DeviceProtocol;
    onDeviceSelect: (device: Device) => void;
}

export default function AddDeviceStep({ deviceProtocol, onDeviceSelect }: Props) {
    switch (deviceProtocol) {
        case DeviceProtocol.Virtual: {
            return null;
        }

        case DeviceProtocol.Zigbee: {
            return <AddZigbeeDeviceStep onDeviceSelect={onDeviceSelect} />;
        }
    }
}
