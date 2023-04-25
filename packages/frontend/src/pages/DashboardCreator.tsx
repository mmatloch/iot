import { ActionToolbar } from '@components/ActionToolbar';
import { DashboardCreator } from '@features/dashboards';
import { SelectWidgetMenu } from '@features/widgets';
import Layout from '@layout/Layout';
import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function DashboardCreatorPage() {
    const { t } = useTranslation();

    const [widgetMenuAnchorEl, setWidgetMenuAnchorEl] = useState<null | HTMLElement>(null);

    const openWidgetMenu = (event: MouseEvent<HTMLButtonElement>) => {
        setWidgetMenuAnchorEl(event.currentTarget);
    };

    const closeWidgetMenu = () => {
        setWidgetMenuAnchorEl(null);
    };

    return (
        <Layout>
            <ActionToolbar
                title={t('dashboards:creator.title')}
                buttons={
                    <Button size="large" onClick={openWidgetMenu} endIcon={<Add fontSize="inherit" />}>
                        {t('dashboards:creator.addWidget')}
                    </Button>
                }
            />

            <DashboardCreator />

            <SelectWidgetMenu onClose={closeWidgetMenu} anchorEl={widgetMenuAnchorEl} />
        </Layout>
    );
}
