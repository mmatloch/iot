import { useEvent } from '@api/eventsApi';
import FailedToLoadDataDialog from '@components/FailedToLoadDataDialog';
import FullScreenLoader from '@components/FullScreenLoader';
import { useParams } from 'react-router-dom';

import EventEditor from './EventEditor';

export default function EventEditorWrapper() {
    const { eventId: eventIdFromParam } = useParams();
    const eventId = Number(eventIdFromParam);

    const { data: event, isLoading, isSuccess } = useEvent(eventId);

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (!isSuccess) {
        return <FailedToLoadDataDialog />;
    }

    return <EventEditor event={event} />;
}
