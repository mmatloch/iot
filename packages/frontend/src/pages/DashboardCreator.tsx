import { ActionToolbar } from '@components/ActionToolbar';
import { Widget } from '@definitions/entities/widgetTypes';
import { DashboardEditorForm, useDashboardCreator } from '@features/dashboards';
import { SelectWidgetMenu } from '@features/widgets';
import Layout from '@layout/Layout';
import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import { MouseEvent, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export default function DashboardCreatorPage() {
    const { t } = useTranslation('dashboards');
    const { methods, handleSave, handleSubmit, addWidget } = useDashboardCreator();

    const [widgetMenuAnchorEl, setWidgetMenuAnchorEl] = useState<null | HTMLElement>(null);

    const openWidgetMenu = (event: MouseEvent<HTMLButtonElement>) => {
        setWidgetMenuAnchorEl(event.currentTarget);
    };

    const closeWidgetMenu = () => {
        setWidgetMenuAnchorEl(null);
    };

    const handleWidgetSelect = (widget: Widget) => {
        addWidget(widget);
        closeWidgetMenu();
    };

    return (
        <Layout>
            <FormProvider {...methods}>
                <ActionToolbar
                    title={t('creator.title')}
                    onSaveClick={handleSubmit(handleSave)}
                    buttons={
                        <Button size="large" onClick={openWidgetMenu} endIcon={<Add fontSize="inherit" />}>
                            {t('creator.addWidget')}
                        </Button>
                    }
                />

                <DashboardEditorForm />

                <SelectWidgetMenu
                    onClose={closeWidgetMenu}
                    onSelect={handleWidgetSelect}
                    anchorEl={widgetMenuAnchorEl}
                />
            </FormProvider>
        </Layout>
    );
}
