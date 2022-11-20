import { useDeviceDetails } from '../hooks/useDeviceDetails';
import DeviceDetailsDrawer from './DeviceDetailsDrawer';

export default function DeviceDetailsDrawerWrapper() {
    const { deviceId, closeDeviceDetails, isOpen } = useDeviceDetails();

    if (!deviceId) {
        return null;
    }

    const onClose = () => {
        closeDeviceDetails();
    };

    return <DeviceDetailsDrawer deviceId={deviceId} open={isOpen} onClose={onClose} />;
}
