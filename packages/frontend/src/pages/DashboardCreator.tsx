import SearchToolbar from '@components/search/SearchToolbar';
import { DashboardCreator } from '@features/dashboards';
import Layout from '@layout/Layout';
import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function DashboardCreatorPage() {
    const { t } = useTranslation();

    const onAddWidget = () => {};

    return (
        <Layout>
            <SearchToolbar
                title={t('dashboards:creator.title')}
                buttons={
                    <Button size="large" onClick={onAddWidget} endIcon={<Add fontSize="inherit" />}>
                        {t('dashboards:creator.addWidget')}
                    </Button>
                }
            />

            <DashboardCreator />
        </Layout>
    );
}
