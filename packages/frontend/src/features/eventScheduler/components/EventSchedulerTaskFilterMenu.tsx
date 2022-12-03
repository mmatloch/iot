import EventAutocomplete from '@components/events/EventAutocomplete';
import EventAutocompleteWrapper from '@components/events/EventAutocompleteWrapper';
import SearchFilterMenu from '@components/search/SearchFilterMenu';
import type { EventSchedulerTasksSearchQuery } from '@definitions/entities/eventSchedulerTypes';
import type { Event } from '@definitions/entities/eventTypes';
import { SetSearchQuery } from '@hooks/search/useSearchQuery';
import { FormControl, ListItem } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
    onClose: () => void;
    anchorEl: HTMLElement | null;

    setSearchQuery: SetSearchQuery<EventSchedulerTasksSearchQuery>;
    searchQuery: EventSchedulerTasksSearchQuery;
}

export default function EventSchedulerTaskFilterMenu({ onClose, anchorEl, setSearchQuery, searchQuery }: Props) {
    const { t } = useTranslation();
    const currentEventId = Number(searchQuery.filters?.eventId);

    const handleEventSelect = (_: unknown, selectedEvent: Event | null) => {
        if (selectedEvent) {
            setSearchQuery({
                filters: {
                    eventId: selectedEvent._id,
                },
            });

            return;
        }

        setSearchQuery({
            filters: {
                eventId: undefined,
            },
        });
    };

    return (
        <SearchFilterMenu
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onClose={onClose}
            anchorEl={anchorEl}
        >
            <ListItem>
                <FormControl sx={{ width: '100%', mt: 1 }}>
                    {Number.isInteger(currentEventId) ? (
                        <EventAutocompleteWrapper
                            eventId={currentEventId}
                            onChange={handleEventSelect}
                            InputProps={{ label: t('generic:search.filtering.filterByEvent') }}
                        />
                    ) : (
                        <EventAutocomplete
                            onChange={handleEventSelect}
                            InputProps={{ label: t('generic:search.filtering.filterByEvent') }}
                        />
                    )}
                </FormControl>
            </ListItem>
        </SearchFilterMenu>
    );
}
