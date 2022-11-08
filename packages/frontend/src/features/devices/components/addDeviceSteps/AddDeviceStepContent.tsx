import { Device, DeviceProtocol } from '@definitions/entities/deviceTypes';

import AddZigbeeDeviceStepContent from './AddZigbeeDeviceStepContent';

interface Props {
    deviceProtocol: DeviceProtocol;
    onDeviceSelect: (device: Device) => void;
}

export default function AddDeviceStepContent({ deviceProtocol, onDeviceSelect }: Props) {
    switch (deviceProtocol) {
        case DeviceProtocol.Virtual: {
            return null;
        }

        case DeviceProtocol.Zigbee: {
            return <AddZigbeeDeviceStepContent onDeviceSelect={onDeviceSelect} />;
        }
    }
}
