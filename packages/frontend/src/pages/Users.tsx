import { useUsers } from '@api/usersApi';
import FailedToLoadDataDialog from '@components/FailedToLoadDataDialog';
import FullScreenLoader from '@components/FullScreenLoader';
import UserCard from '@features/users/components/UserCard';
import useQueryPage from '@hooks/useQueryPage';
import Layout from '@layout/Layout';
import { Box, Container, Grid, Pagination } from '@mui/material';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

export default function Users() {
    const { t } = useTranslation();
    const { page, setPage } = useQueryPage();

    const { data, isSuccess, isLoading, isPreviousData } = useUsers({
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

    return (
        <Layout>
            <Container>
                <h1>{t('users:title')}</h1>

                <Grid container spacing={5} direction="row" justifyContent="center" alignItems="center">
                    {data._hits.map((user) => (
                        <Grid item key={user._id} sx={{ display: 'flex' }}>
                            <UserCard user={user} />
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
