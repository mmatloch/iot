import DeviceAutocomplete from '@components/devices/DeviceAutocomplete';
import DeviceAutocompleteWrapper from '@components/devices/DeviceAutocompleteWrapper';
import EventAutocomplete from '@components/events/EventAutocomplete';
import EventAutocompleteWrapper from '@components/events/EventAutocompleteWrapper';
import SearchFilterSorting from '@components/search/filters/SearchFilterSorting';
import { Device } from '@definitions/entities/deviceTypes';
import { EventInstancesSearchQuery } from '@definitions/entities/eventInstanceTypes';
import type { Event } from '@definitions/entities/eventTypes';
import { ClearAll, FilterListOff } from '@mui/icons-material';
import {
    Divider,
    FormControl,
    IconButton,
    ListItem,
    ListSubheader,
    Menu,
    MenuList,
    Stack,
    Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
    onClose: () => void;
    onFilterChange: (query: EventInstancesSearchQuery) => void;
    searchQuery: EventInstancesSearchQuery;
    anchorEl: HTMLElement | null;
}

export default function EventInstanceFilterMenu({ onClose, anchorEl, onFilterChange, searchQuery }: Props) {
    const { t } = useTranslation();
    const currentEventId = Number(searchQuery.filters?.eventId);
    const currentDeviceId = Number(searchQuery.filters?.deviceId);
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

    const handleDeviceSelect = (_: unknown, selectedDevice: Device | null) => {
        if (selectedDevice) {
            onFilterChange({
                filters: {
                    deviceId: selectedDevice._id,
                },
            });

            return;
        }

        onFilterChange({
            filters: {
                deviceId: undefined,
            },
        });
    };

    const clearFilters = () => {
        onFilterChange(undefined);
    };

    const additionalEventSearchQuery = Number.isInteger(currentDeviceId)
        ? {
              filters: {
                  deviceId: currentDeviceId,
              },
          }
        : undefined;

    return (
        <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={onClose}>
            <MenuList sx={{ pt: 0, width: '350px' }}>
                <ListSubheader sx={{ bgcolor: 'transparent' }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} sx={{ mb: 1 }}>
                        <Typography>{t('generic:search.filtering.title')}</Typography>

                        <IconButton onClick={clearFilters}>
                            <FilterListOff />
                        </IconButton>
                    </Stack>
                </ListSubheader>

                <Divider />

                <ListItem>
                    <FormControl sx={{ width: '100%', mt: 1 }}>
                        {Number.isInteger(currentDeviceId) ? (
                            <DeviceAutocompleteWrapper
                                deviceId={currentDeviceId}
                                onChange={handleDeviceSelect}
                                InputProps={{ label: t('generic:search.filtering.filterByDevice') }}
                            />
                        ) : (
                            <DeviceAutocomplete
                                onChange={handleDeviceSelect}
                                InputProps={{ label: t('generic:search.filtering.filterByDevice') }}
                            />
                        )}
                    </FormControl>
                </ListItem>

                <ListItem>
                    <FormControl sx={{ width: '100%', mt: 1 }}>
                        {Number.isInteger(currentEventId) ? (
                            <EventAutocompleteWrapper
                                eventId={currentEventId}
                                onChange={handleEventSelect}
                                InputProps={{ label: t('generic:search.filtering.filterByEvent') }}
                                searchQuery={additionalEventSearchQuery}
                            />
                        ) : (
                            <EventAutocomplete
                                onChange={handleEventSelect}
                                InputProps={{ label: t('generic:search.filtering.filterByEvent') }}
                                searchQuery={additionalEventSearchQuery}
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
