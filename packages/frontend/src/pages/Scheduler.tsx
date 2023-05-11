import { useEventSchedulerTasks } from '@api/eventSchedulerApi';
import { ActionToolbar } from '@components/ActionToolbar';
import FailedToLoadDataDialog from '@components/FailedToLoadDataDialog';
import FullScreenLoader from '@components/FullScreenLoader';
import EntityCardGrid from '@components/grid/EntityCardGrid';
import SearchPagination from '@components/search/SearchPagination';
import { EventSchedulerTasksSearchQuery } from '@definitions/entities/eventSchedulerTypes';
import EventSchedulerTaskCard from '@features/eventScheduler/components/EventSchedulerTaskCard';
import EventSchedulerTaskFilterMenu from '@features/eventScheduler/components/EventSchedulerTaskFilterMenu';
import { useSearchQuery } from '@hooks/search/useSearchQuery';
import Layout from '@layout/Layout';
import { Box, Container } from '@mui/material';
import type { MouseEvent } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { AppRoute } from '../constants';

export default function Scheduler() {
    const { t } = useTranslation('eventScheduler');
    const navigate = useNavigate();
    const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState<null | HTMLElement>(null);

    const { setSearchQuery, searchQuery } = useSearchQuery<EventSchedulerTasksSearchQuery>({});
    const { data, isLoading, isSuccess, isPreviousData } = useEventSchedulerTasks(searchQuery);

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (!isSuccess) {
        return <FailedToLoadDataDialog />;
    }

    const redirectToEventCreator = () => {
        navigate(AppRoute.Events.Creator);
    };

    const openFilterMenu = (event: MouseEvent<HTMLButtonElement>) => {
        setFilterMenuAnchorEl(event.currentTarget);
    };

    const closeFilterMenu = () => {
        setFilterMenuAnchorEl(null);
    };

    return (
        <Layout>
            <Container>
                <ActionToolbar
                    title={t('title')}
                    onCreateClick={redirectToEventCreator}
                    onFiltersClick={openFilterMenu}
                />

                <EntityCardGrid entities={data._hits} Item={EventSchedulerTaskCard} />

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

            <EventSchedulerTaskFilterMenu
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onClose={closeFilterMenu}
                anchorEl={filterMenuAnchorEl}
            />
        </Layout>
    );
}
