import { useEvents } from '@api/eventsApi';
import FailedToLoadDataDialog from '@components/FailedToLoadDataDialog';
import FullScreenLoader from '@components/FullScreenLoader';
import EntityCardGrid from '@components/grid/EntityCardGrid';
import SearchPagination from '@components/search/SearchPagination';
import SearchToolbarWithInput from '@components/search/SearchToolbarWithInput';
import type { EventsSearchQuery } from '@definitions/entities/eventTypes';
import { SortValue } from '@definitions/searchTypes';
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

const defaultQuery: EventsSearchQuery = {
    sort: {
        _createdAt: SortValue.Desc,
    },
    filters: {
        _createdBy: {
            $exists: true,
        },
    },
};

const SEARCH_FIELD = 'displayName';

export default function Events() {
    const { t } = useTranslation('events');
    const navigate = useNavigate();
    const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState<null | HTMLElement>(null);

    const { searchQuery, setSearchQuery } = useSearchQuery<EventsSearchQuery>({
        defaultQuery: defaultQuery,
    });
    const { data, isSuccess, isLoading, isPreviousData } = useEvents(searchQuery);

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
                <SearchToolbarWithInput
                    title={t('title')}
                    searchLabel={t('search.inputLabel')}
                    onCreateClick={redirectToCreator}
                    onFiltersClick={openFilterMenu}
                    setSearchQuery={setSearchQuery}
                    searchQuery={searchQuery}
                    searchField={SEARCH_FIELD}
                />

                <EntityCardGrid entities={data._hits} Item={EventCard} />

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

            <EventFilterMenu
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onClose={closeFilterMenu}
                anchorEl={filterMenuAnchorEl}
            />
        </Layout>
    );
}
