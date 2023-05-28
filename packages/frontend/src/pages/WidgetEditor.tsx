import { ActionToolbar } from '@components/ActionToolbar';
import { Widget } from '@definitions/entities/widgetTypes';
import { WidgetEditorForm, WidgetEditorPreview, useWidgetEditor } from '@features/widgets';
import Layout from '@layout/Layout';
import { Container } from '@mui/material';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Props {
    widget: Widget;
}

export default function WidgetEditorPage({ widget }: Props) {
    const { t } = useTranslation('widgets');
    const { methods, handleSave, handleSubmit } = useWidgetEditor({ widget });

    return (
        <Layout>
            <FormProvider {...methods}>
                <Container>
                    <ActionToolbar title={t('editor.title')} onSaveClick={handleSubmit(handleSave)} />

                    <WidgetEditorForm />
                </Container>

                <WidgetEditorPreview />
            </FormProvider>
        </Layout>
    );
}
