import EventAutocomplete from '@components/events/EventAutocomplete';
import EventAutocompleteWrapper from '@components/events/EventAutocompleteWrapper';
import { Event } from '@definitions/entities/eventTypes';
import { useWidgetForm } from '@features/widgets/hooks/useWidgetForm';
import { useTranslation } from 'react-i18next';

export const OnActionEventSelector = () => {
    const { t } = useTranslation();
    const { watch, setValue } = useWidgetForm();
    const action = watch('action');

    const handleEventSelect = (_e: unknown, event: Event) => {
        setValue('action.on.eventId', event._id);
    };

    const currentEventId = action?.on.eventId;

    if (currentEventId) {
        return (
            <EventAutocompleteWrapper
                eventId={currentEventId}
                onChange={handleEventSelect}
                InputProps={{ label: t('search.selecting.selectEvent') }}
            />
        );
    }

    return <EventAutocomplete onChange={handleEventSelect} InputProps={{ label: t('search.selecting.selectEvent') }} />;
};
