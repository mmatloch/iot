import { useUsers } from '@api/usersApi';
import FullScreenLoader from '@components/FullScreenLoader';
import UserCard from '@features/users/components/UserCard';
import { Box, Container, Grid, Pagination } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

export default function UserManagement() {
    const { t } = useTranslation();
    const { data, isSuccess, isLoading } = useUsers();
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

    const pageCount = data._meta.totalHits / 10;

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
                <Pagination count={pageCount} size="large" color="primary" />
            </Box>
        </Container>
    );
}
