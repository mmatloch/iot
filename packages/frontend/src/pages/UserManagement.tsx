import { useUsers } from '@api/usersApi';
import FullScreenLoader from '@components/FullScreenLoader';
import { SortValue } from '@definitions/searchTypes';
import UserCard from '@features/users/components/UserCard';
import useQueryPage from '@hooks/useQueryPage';
import { Box, Container, Grid, Pagination } from '@mui/material';
import { useSnackbar } from 'notistack';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

const sortQuery = {
    _createdAt: SortValue.Desc,
};

export default function UserManagement() {
    const { t } = useTranslation();
    const { page, setPage } = useQueryPage();

    const { data, isSuccess, isLoading, isPreviousData } = useUsers({
        page,
        sort: sortQuery,
    });

    const { enqueueSnackbar } = useSnackbar();

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (!isSuccess) {
        enqueueSnackbar(t('users:errors.failedToLoadUsers'), {
            variant: 'error',
        });

        return <FullScreenLoader />;
    }

    const onPageChange = (_event: ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <Container>
            <h1>{t('users:management.title')}</h1>

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
    );
}
