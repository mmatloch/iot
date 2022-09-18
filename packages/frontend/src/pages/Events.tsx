import { useEvents } from '@api/eventsApi';
import FailedToLoadDataDialog from '@components/FailedToLoadDataDialog';
import FullScreenLoader from '@components/FullScreenLoader';
import { EventsSearchQuery } from '@definitions/eventTypes';
import { SortValue } from '@definitions/searchTypes';
import EventCard from '@features/events/components/EventCard';
import EventFilterMenu from '@features/events/components/EventFilterMenu';
import useQueryPage from '@hooks/useQueryPage';
import Layout from '@layout/Layout';
import { FilterList } from '@mui/icons-material';
import { Box, Button, Container, Grid, Pagination, Toolbar, Typography } from '@mui/material';
import { mergeQuery } from '@utils/searchQuery';
import { ChangeEvent, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

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

export default function Events() {
    const { t } = useTranslation();
    const { page, setPage } = useQueryPage();
    const [eventFilterMenuAnchorEl, setEventFilterMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [searchQuery, setSearchQuery] = useState<EventsSearchQuery>(defaultQuery);

    const { data, isSuccess, isLoading, isPreviousData } = useEvents({
        ...searchQuery,
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

    const openEventFilterMenu = (event: MouseEvent<HTMLButtonElement>) => {
        setEventFilterMenuAnchorEl(event.currentTarget);
    };

    const closeEventFilterMenu = () => {
        setEventFilterMenuAnchorEl(null);
    };

    const onFilterChange = (updatedQuery: EventsSearchQuery) => {
        setSearchQuery(mergeQuery(searchQuery, updatedQuery));
    };

    return (
        <Layout>
            <Container>
                <Toolbar sx={{ mb: 3 }}>
                    <Typography sx={{ typography: { sm: 'h4', xs: 'h5' }, flexGrow: 1 }} component="div">
                        {t('events:title')}
                    </Typography>
                    <Button size="large" onClick={openEventFilterMenu} endIcon={<FilterList fontSize="inherit" />}>
                        {t('generic:search.filters')}
                    </Button>

                    <EventFilterMenu
                        searchQuery={searchQuery}
                        onFilterChange={onFilterChange}
                        onClose={closeEventFilterMenu}
                        anchorEl={eventFilterMenuAnchorEl}
                    />
                </Toolbar>
                <Grid container spacing={5} direction="row" justifyContent="center" alignItems="center">
                    {data._hits.map((event) => (
                        <Grid item key={event._id} sx={{ display: 'flex' }}>
                            <EventCard event={event} />
                        </Grid>
                    ))}
                </Grid>

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
            </Container>
        </Layout>
    );
}
