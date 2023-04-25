import { ActionToolbar } from '@components/ActionToolbar';
import { Widgets } from '@features/widgets';
import Layout from '@layout/Layout';
import { Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { AppRoute } from '../constants';

export default function WidgetsPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const redirectToCreator = () => {
        navigate(AppRoute.Widgets.Creator);
    };

    return (
        <Layout>
            <Container>
                <ActionToolbar title={t('widgets:title')} onCreateClick={redirectToCreator} />

                <Widgets />
            </Container>
        </Layout>
    );
}
