import { useEventInstanceDetails } from '../hooks/useEventInstanceDetails';
import EventInstanceDetailsDrawer from './EventInstanceDetailsDrawer';

export default function EventInstanceDetailsDrawerWrapper() {
    const { eventInstanceId, closeEventInstanceDetails, isOpen } = useEventInstanceDetails();

    if (!eventInstanceId) {
        return null;
    }

    const onClose = () => {
        closeEventInstanceDetails();
    };

    return <EventInstanceDetailsDrawer eventInstanceId={eventInstanceId} open={isOpen} onClose={onClose} />;
}
