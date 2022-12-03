import { useEventInstances } from '@api/eventInstancesApi';
import { useEvents } from '@api/eventsApi';
import FailedToLoadDataDialog from '@components/FailedToLoadDataDialog';
import FullScreenLoader from '@components/FullScreenLoader';
import EntityCardGrid from '@components/grid/EntityCardGrid';
import SearchPagination from '@components/search/SearchPagination';
import SearchToolbar from '@components/search/SearchToolbar';
import SearchToolbarWithInput from '@components/search/SearchToolbarWithInput';
import type { EventInstance, EventInstancesSearchQuery } from '@definitions/entities/eventInstanceTypes';
import type { EventsSearchQuery } from '@definitions/entities/eventTypes';
import { Event } from '@definitions/entities/eventTypes';
import EventInstanceCard from '@features/eventInstances/components/EventInstanceCard';
import EventInstanceDetailsDrawer from '@features/eventInstances/components/EventInstanceDetailsDrawer';
import EventInstanceDetailsDrawerWrapper from '@features/eventInstances/components/EventInstanceDetailsDrawerWrapper';
import EventInstanceFilterMenu from '@features/eventInstances/components/EventInstanceFilterMenu';
import EventCard from '@features/events/components/EventCard';
import EventFilterMenu from '@features/events/components/EventFilterMenu';
import { useSearchQuery } from '@hooks/search/useSearchQuery';
import Layout from '@layout/Layout';
import { Box, Container } from '@mui/material';
import type { MouseEvent } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { AppRoute } from '../constants';

const defaultQuery: EventsSearchQuery = {};

const SEARCH_FIELD = 'displayName';

const SIZE_MAP = {
    md: 10,
    lg: 18,
};

export default function EventInstances() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState<null | HTMLElement>(null);

    const { searchQuery, setSearchQuery } = useSearchQuery<EventInstancesSearchQuery>({
        defaultQuery: defaultQuery,
        loadRelations: false,
        defaultSizeMap: SIZE_MAP,
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

    return (
        <Layout>
            <Container>
                <SearchToolbar title={t('eventInstances:title')} onFiltersClick={openFilterMenu} />

                <EntityCardGrid entities={data._hits} Item={EventInstanceCard} spacing={3} />

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

            <EventInstanceFilterMenu
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onClose={closeFilterMenu}
                anchorEl={filterMenuAnchorEl}
            />
            <EventInstanceDetailsDrawerWrapper />
        </Layout>
    );
}
