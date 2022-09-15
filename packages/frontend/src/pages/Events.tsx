import { useEvents } from '@api/eventsApi';
import FailedToLoadDataDialog from '@components/FailedToLoadDataDialog';
import FullScreenLoader from '@components/FullScreenLoader';
import { SortValue } from '@definitions/searchTypes';
import EventCard from '@features/events/components/EventCard';
import useQueryPage from '@hooks/useQueryPage';
import Layout from '@layout/Layout';
import { Box, Container, Grid, Pagination } from '@mui/material';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

const sortQuery = {
    _createdAt: SortValue.Desc,
};

export default function Events() {
    const { t } = useTranslation();
    const { page, setPage } = useQueryPage();

    const { data, isSuccess, isLoading, isPreviousData } = useEvents({
        page,
        sort: sortQuery,
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

    return (
        <Layout>
            <Container>
                <h1>{t('events:title')}</h1>

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
