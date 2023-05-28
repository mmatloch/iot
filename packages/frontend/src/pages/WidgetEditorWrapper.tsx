import { useWidget } from '@api/widgetsApi';
import FailedToLoadDataDialog from '@components/FailedToLoadDataDialog';
import FullScreenLoader from '@components/FullScreenLoader';
import { useParams } from 'react-router-dom';

import WidgetEditorPage from './WidgetEditor';

export default function WidgetEditorWrapperPage() {
    const { widgetId: widgetIdFromParam } = useParams();
    const widgetId = Number(widgetIdFromParam);

    const { data: widget, isLoading, isSuccess } = useWidget(widgetId);

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (!isSuccess) {
        return <FailedToLoadDataDialog />;
    }

    return <WidgetEditorPage widget={widget} />;
}
