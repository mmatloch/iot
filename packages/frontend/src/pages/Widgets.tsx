import { useWidgets } from '@api/widgetsApi';
import { ActionToolbar } from '@components/ActionToolbar';
import FailedToLoadDataDialog from '@components/FailedToLoadDataDialog';
import FullScreenLoader from '@components/FullScreenLoader';
import EntityCardGrid from '@components/grid/EntityCardGrid';
import { WidgetCard } from '@features/widgets';
import Layout from '@layout/Layout';
import { Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { AppRoute } from '../constants';

export default function WidgetsPage() {
    const { t } = useTranslation('widgets');
    const navigate = useNavigate();
    const { data, isLoading, isSuccess } = useWidgets({});

    const redirectToCreator = () => {
        navigate(AppRoute.Widgets.Creator);
    };

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (!isSuccess) {
        return <FailedToLoadDataDialog />;
    }

    return (
        <Layout>
            <Container>
                <ActionToolbar title={t('title')} onCreateClick={redirectToCreator} />

                <EntityCardGrid entities={data._hits} Item={WidgetCard} />
            </Container>
        </Layout>
    );
}
