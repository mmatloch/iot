import { useUsers } from '@api/usersApi';
import FullScreenLoader from '@components/FullScreenLoader';
import UserCard from '@features/users/components/UserCard';
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
        enqueueSnackbar(t('users:management.failedToLoadUsers'), {
            variant: 'error',
        });

        return <FullScreenLoader />;
    }

    return (
        <div>
            <h1>{t('users:management.title')}</h1>

            {data._hits.map((user) => (
                <UserCard user={user} />
            ))}
        </div>
    );
}
