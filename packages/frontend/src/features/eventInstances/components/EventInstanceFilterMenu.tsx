import DeviceAutocomplete from '@components/devices/DeviceAutocomplete';
import DeviceAutocompleteWrapper from '@components/devices/DeviceAutocompleteWrapper';
import EventAutocomplete from '@components/events/EventAutocomplete';
import EventAutocompleteWrapper from '@components/events/EventAutocompleteWrapper';
import SearchFilterSelect from '@components/search/filters/SearchFilterSelect';
import SearchFilterMenu from '@components/search/SearchFilterMenu';
import { Device } from '@definitions/entities/deviceTypes';
import { EventInstanceState, EventInstancesSearchQuery } from '@definitions/entities/eventInstanceTypes';
import type { Event } from '@definitions/entities/eventTypes';
import { SetSearchQuery } from '@hooks/search/useSearchQuery';
import { FormControl, ListItem } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
    onClose: () => void;
    anchorEl: HTMLElement | null;

    setSearchQuery: SetSearchQuery<EventInstancesSearchQuery>;
    searchQuery: EventInstancesSearchQuery;
}

export default function EventInstanceFilterMenu({ onClose, anchorEl, setSearchQuery, searchQuery }: Props) {
    const { t } = useTranslation(['generic', 'eventInstances']);
    const currentEventId = Number(searchQuery.filters?.eventId);
    const currentDeviceId = Number(searchQuery.filters?.deviceId);

    const stateFilterMap = [
        {
            path: 'filters.state',
            value: EventInstanceState.Success,
            option: EventInstanceState.Success,
            text: t(`eventInstances:state.${EventInstanceState.Success}`),
        },
        {
            path: 'filters.state',
            value: EventInstanceState.ConditionNotMet,
            option: EventInstanceState.ConditionNotMet,
            text: t(`eventInstances:state.${EventInstanceState.ConditionNotMet}`),
        },
        {
            path: 'filters.state',
            value: EventInstanceState.FailedOnAction,
            option: EventInstanceState.FailedOnAction,
            text: t(`eventInstances:state.${EventInstanceState.FailedOnAction}`),
        },
        {
            path: 'filters.state',
            value: EventInstanceState.FailedOnCondition,
            option: EventInstanceState.FailedOnCondition,
            text: t(`eventInstances:state.${EventInstanceState.FailedOnCondition}`),
        },
    ];

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

    const handleDeviceSelect = (_: unknown, selectedDevice: Device | null) => {
        if (selectedDevice) {
            setSearchQuery({
                filters: {
                    deviceId: selectedDevice._id,
                },
            });

            return;
        }

        setSearchQuery({
            filters: {
                deviceId: undefined,
            },
        });
    };

    const additionalEventSearchQuery = Number.isInteger(currentDeviceId)
        ? {
              filters: {
                  deviceId: currentDeviceId,
              },
          }
        : undefined;

    return (
        <SearchFilterMenu
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onClose={onClose}
            anchorEl={anchorEl}
        >
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

            <SearchFilterSelect
                label={t('generic:entity.state')}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterMap={stateFilterMap}
            />
        </SearchFilterMenu>
    );
}
