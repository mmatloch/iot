import { useDevices } from '@api/devicesApi';
import ErrorDialog from '@components/ErrorDialog';
import FullScreenLoader from '@components/FullScreenLoader';
import useQueryPage from '@hooks/useQueryPage';
import Layout from '@layout/Layout';
import { Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function Devices() {
    const { t } = useTranslation();
    const { page, setPage } = useQueryPage();

    const { data, isSuccess, isLoading } = useDevices({
        page,
    });

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (!isSuccess) {
        return (
            <ErrorDialog
                title={t('generic:errors.failedToLoadData')}
                message={t('generic:errors.noInternetConnection')}
            />
        );
    }

    return (
        <Layout>
            <Container>
                <h1>{t('devices:title')}</h1>
            </Container>
        </Layout>
    );
}
