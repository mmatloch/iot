import { useEventInstances } from '@api/eventInstancesApi';
import { ActionToolbar } from '@components/ActionToolbar';
import FailedToLoadDataDialog from '@components/FailedToLoadDataDialog';
import FullScreenLoader from '@components/FullScreenLoader';
import EntityCardGrid from '@components/grid/EntityCardGrid';
import SearchPagination from '@components/search/SearchPagination';
import type { EventInstancesSearchQuery } from '@definitions/entities/eventInstanceTypes';
import type { EventsSearchQuery } from '@definitions/entities/eventTypes';
import EventInstanceCard from '@features/eventInstances/components/EventInstanceCard';
import EventInstanceDetailsDrawerWrapper from '@features/eventInstances/components/EventInstanceDetailsDrawerWrapper';
import EventInstanceFilterMenu from '@features/eventInstances/components/EventInstanceFilterMenu';
import { useSearchQuery } from '@hooks/search/useSearchQuery';
import Layout from '@layout/Layout';
import { Box, Container } from '@mui/material';
import type { MouseEvent } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const defaultQuery: EventsSearchQuery = {};

const SIZE_MAP = {
    md: 10,
    lg: 18,
};

export default function EventInstances() {
    const { t } = useTranslation('eventInstances');
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
                <ActionToolbar title={t('title')} onFiltersClick={openFilterMenu} />

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
