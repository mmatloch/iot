import EventAutocomplete from '@components/events/EventAutocomplete';
import EventAutocompleteWrapper from '@components/events/EventAutocompleteWrapper';
import FormInputText from '@components/forms/FormInputText';
import { Event } from '@definitions/entities/eventTypes';
import { useTextLinesForm } from '@features/widgets/hooks/useTextLinesForm';
import { useWidgetForm } from '@features/widgets/hooks/useWidgetForm';
import { Stack } from '@mui/material';
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
        });
    };

    const currentEventId = textLines[lineIndex]?.eventId;

    return (
        <Stack spacing={1}>
            {currentEventId ? (
                <EventAutocompleteWrapper
                    eventId={currentEventId}
                    onChange={handleEventSelect}
                    InputProps={{ label: t('search.selecting.selectEvent') }}
                />
            ) : (
                <EventAutocomplete
                    onChange={handleEventSelect}
                    InputProps={{ label: t('search.selecting.selectEvent') }}
                />
            )}

            <FormInputText name={`textLines.${lineIndex}.value`} label={t('value')} />
        </Stack>
    );
};
