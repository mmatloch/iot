import { useEvent } from '@api/eventsApi';
import { TextField } from '@mui/material';

import EventAutocomplete, { Props as EventAutocompleteProps } from './EventAutocomplete';

interface Props extends EventAutocompleteProps {
    eventId: number;
}

export default function EventAutocompleteWrapper({ eventId, ...props }: Props) {
    const { data, isSuccess } = useEvent(eventId);

    if (isSuccess) {
        return <EventAutocomplete defaultValue={data} {...props} />;
    }

    return <TextField />;
}
