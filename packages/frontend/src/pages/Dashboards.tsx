import SearchToolbar from '@components/search/SearchToolbar';
import { Dashboards } from '@features/dashboards';
import Layout from '@layout/Layout';
import { Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { AppRoute } from '../constants';

export default function DashboardsPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const redirectToCreator = () => {
        navigate(AppRoute.Dashboards.Creator);
    };

    return (
        <Layout>
            <Container>
                <SearchToolbar title={t('dashboards:title')} onCreateClick={redirectToCreator} />

                <Dashboards />
            </Container>
        </Layout>
    );
}
