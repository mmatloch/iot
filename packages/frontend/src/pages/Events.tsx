import { useEvents } from '@api/eventsApi';
import FailedToLoadDataDialog from '@components/FailedToLoadDataDialog';
import FullScreenLoader from '@components/FullScreenLoader';
import EntityCardGrid from '@components/grid/EntityCardGrid';
import SearchToolbar from '@components/search/SearchToolbar';
import { EventsSearchQuery } from '@definitions/entities/eventTypes';
import { SortValue } from '@definitions/searchTypes';
import EventCard from '@features/events/components/EventCard';
import EventFilterMenu from '@features/events/components/EventFilterMenu';
import { useDebounce } from '@hooks/useDebounce';
import useQueryPage from '@hooks/useQueryPage';
import Layout from '@layout/Layout';
import { Box, Container, Grid, Pagination } from '@mui/material';
import { mergeQuery } from '@utils/searchQuery';
import { ChangeEvent, MouseEvent, useState } from 'react';
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
    relations: {
        _createdByUser: true,
        _updatedByUser: true,
    },
};

export default function Events() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { page, setPage } = useQueryPage();
    const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [searchQuery, setSearchQuery] = useState<EventsSearchQuery>(defaultQuery);
    const [searchValue, setSearchValue] = useState('');
    const debouncedSearchValue = useDebounce(searchValue, 200);

    const { data, isSuccess, isLoading, isPreviousData } = useEvents({
        ...searchQuery,
        filters: {
            ...searchQuery.filters,
            displayName: {
                $iLike: `${debouncedSearchValue}%`,
            },
        },
        page,
    });

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (!isSuccess) {
        return <FailedToLoadDataDialog />;
    }

    const onPageChange = (_event: ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const openFilterMenu = (event: MouseEvent<HTMLButtonElement>) => {
        setFilterMenuAnchorEl(event.currentTarget);
    };

    const closeFilterMenu = () => {
        setFilterMenuAnchorEl(null);
    };

    const onFilterChange = (updatedQuery: EventsSearchQuery) => {
        setSearchQuery(mergeQuery(searchQuery, updatedQuery));
    };

    const redirectToCreator = () => {
        navigate(AppRoute.Events.Creator);
    };

    return (
        <Layout>
            <Container>
                <SearchToolbar
                    title={t('events:title')}
                    searchLabel={t('events:search.inputLabel')}
                    onSearchChange={setSearchValue}
                    onCreateClick={redirectToCreator}
                    onFiltersClick={openFilterMenu}
                />

                <EntityCardGrid entities={data._hits} Item={EventCard} />

                {data._hits.length ? (
                    <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                        <Pagination
                            count={data._meta.totalPages}
                            size="large"
                            color="primary"
                            onChange={onPageChange}
                            page={page}
                            disabled={isPreviousData}
                        />
                    </Box>
                ) : (
                    <></>
                )}
            </Container>

            <EventFilterMenu
                searchQuery={searchQuery}
                onFilterChange={onFilterChange}
                onClose={closeFilterMenu}
                anchorEl={filterMenuAnchorEl}
            />
        </Layout>
    );
}
