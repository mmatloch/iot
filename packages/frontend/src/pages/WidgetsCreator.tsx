import { ActionToolbar } from '@components/ActionToolbar';
import { WidgetEditorForm, WidgetEditorPreview, useWidgetCreator } from '@features/widgets';
import Layout from '@layout/Layout';
import { Container } from '@mui/material';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export default function WidgetCreatorPage() {
    const { t } = useTranslation('widgets');
    const { methods, handleSave, handleSubmit } = useWidgetCreator();

    return (
        <Layout>
            <FormProvider {...methods}>
                <Container>
                    <ActionToolbar title={t('creator.title')} onSaveClick={handleSubmit(handleSave)} />

                    <WidgetEditorForm />
                </Container>

                <WidgetEditorPreview />
            </FormProvider>
        </Layout>
    );
}
