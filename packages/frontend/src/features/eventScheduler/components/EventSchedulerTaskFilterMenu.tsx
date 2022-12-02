import EventAutocomplete from '@components/events/EventAutocomplete';
import EventAutocompleteWrapper from '@components/events/EventAutocompleteWrapper';
import SearchFilterSorting from '@components/search/filters/SearchFilterSorting';
import type { EventSchedulerTasksSearchQuery } from '@definitions/entities/eventSchedulerTypes';
import type { Event } from '@definitions/entities/eventTypes';
import { Divider, FormControl, ListItem, ListSubheader, Menu, MenuList } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
    onClose: () => void;
    onFilterChange: (query: EventSchedulerTasksSearchQuery) => void;
    searchQuery: EventSchedulerTasksSearchQuery;
    anchorEl: HTMLElement | null;
}

export default function EventSchedulerTaskFilterMenu({ onClose, anchorEl, onFilterChange, searchQuery }: Props) {
    const { t } = useTranslation();
    const currentEventId = Number(searchQuery.filters?.eventId);
    const isMenuOpen = Boolean(anchorEl);

    const handleEventSelect = (_: unknown, selectedEvent: Event | null) => {
        if (selectedEvent) {
            onFilterChange({
                filters: {
                    eventId: selectedEvent._id,
                },
            });

            return;
        }

        onFilterChange({
            filters: {
                eventId: undefined,
            },
        });
    };

    return (
        <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={onClose}>
            <MenuList sx={{ pt: 0, width: '350px' }}>
                <ListSubheader sx={{ bgcolor: 'transparent' }}>{t('generic:search.filtering.title')}</ListSubheader>

                <Divider />

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

                <Divider />

                <SearchFilterSorting searchQuery={searchQuery} onFilterChange={onFilterChange} />
            </MenuList>
        </Menu>
    );
}
