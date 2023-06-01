import EventAutocomplete from '@components/events/EventAutocomplete';
import EventAutocompleteWrapper from '@components/events/EventAutocompleteWrapper';
import { Event } from '@definitions/entities/eventTypes';
import { useTextLinesForm } from '@features/widgets/hooks/useTextLinesForm';
import { useWidgetForm } from '@features/widgets/hooks/useWidgetForm';
import { useTranslation } from 'react-i18next';

interface Props {
    lineIndex: number;
}

export const TextLineFromEventContext = ({ lineIndex }: Props) => {
    const { t } = useTranslation();
    const { update } = useTextLinesForm();
    const { watch } = useWidgetForm();
    const textLines = watch('textLines');

    const handleEventSelect = (_e: unknown, event: Event) => {
        update(lineIndex, {
            id: textLines[lineIndex].id,
            value: textLines[lineIndex].value,
            eventId: event._id,
            deviceId: null,
            styles: textLines[lineIndex].styles,
        });
    };

    const currentEventId = textLines[lineIndex]?.eventId;

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
