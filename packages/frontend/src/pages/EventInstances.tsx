import { useEventInstances } from '@api/eventInstancesApi';
import { useEvents } from '@api/eventsApi';
import FailedToLoadDataDialog from '@components/FailedToLoadDataDialog';
import FullScreenLoader from '@components/FullScreenLoader';
import EntityCardGrid from '@components/grid/EntityCardGrid';
import SearchPagination from '@components/search/SearchPagination';
import SearchToolbar from '@components/search/SearchToolbar';
import SearchToolbarWithInput from '@components/search/SearchToolbarWithInput';
import { EventInstance } from '@definitions/entities/eventInstanceTypes';
import { Event, EventsSearchQuery } from '@definitions/entities/eventTypes';
import EventInstanceCard from '@features/eventInstances/components/EventInstanceCard';
import EventCard from '@features/events/components/EventCard';
import EventFilterMenu from '@features/events/components/EventFilterMenu';
import { useSearchQuery } from '@hooks/search/useSearchQuery';
import Layout from '@layout/Layout';
import { Box, Container } from '@mui/material';
import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { AppRoute } from '../constants';

const defaultQuery: EventsSearchQuery = {};

const SEARCH_FIELD = 'displayName';

export default function EventInstances() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState<null | HTMLElement>(null);

    const { searchQuery, setSearchQuery } = useSearchQuery<EventInstance>({
        defaultQuery: defaultQuery,
        loadRelations: false,
    });
    const { data, isSuccess, isLoading, isPreviousData } = useEventInstances(searchQuery);

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (!isSuccess) {
        return <FailedToLoadDataDialog />;
    }

    const openFilterMenu = (event: MouseEvent<HTMLButtonElement>) => {
        setFilterMenuAnchorEl(event.currentTarget);
    };

    const closeFilterMenu = () => {
        setFilterMenuAnchorEl(null);
    };

    const redirectToCreator = () => {
        navigate(AppRoute.Events.Creator);
    };

    return (
        <Layout>
            <Container>
                <SearchToolbar
                    title={t('eventInstances:title')}
                    onCreateClick={redirectToCreator}
                    onFiltersClick={openFilterMenu}
                />

                <EntityCardGrid entities={data._hits} Item={EventInstanceCard} />

                {data._hits.length ? (
                    <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                        <SearchPagination
                            data={data}
                            disabled={isPreviousData}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                        />
                    </Box>
                ) : (
                    <></>
                )}
            </Container>

            {/* <EventFilterMenu
                searchQuery={searchQuery}
                onFilterChange={setSearchQuery}
                onClose={closeFilterMenu}
                anchorEl={filterMenuAnchorEl}
            /> */}
        </Layout>
    );
}
