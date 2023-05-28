import { usePreviewWidget } from '@api/widgetsApi';
import FailedToLoadDataDialog from '@components/FailedToLoadDataDialog';
import FullScreenLoader from '@components/FullScreenLoader';
import { WidgetDto } from '@definitions/entities/widgetTypes';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useFormContext } from 'react-hook-form';

import { ResponsiveGridLayoutBreakpoints, ResponsiveGridLayoutCols } from '../../../constants';
import { WidgetCard } from './WidgetCard';

const ResponsiveGridLayout = WidthProvider(Responsive);

const WidgetEditorPreviewContent = () => {
    const { watch } = useFormContext<WidgetDto>();
    const values = watch();

    const { data: widget, isLoading, isSuccess } = usePreviewWidget(values);

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (!isSuccess) {
        return <FailedToLoadDataDialog />;
    }

    return <WidgetCard entity={widget} />;
};

export const WidgetEditorPreview = () => {
    return (
        <ResponsiveGridLayout
            className="layout"
            cols={ResponsiveGridLayoutCols}
            breakpoints={ResponsiveGridLayoutBreakpoints}
        >
            <div key="1">
                <WidgetEditorPreviewContent />
            </div>
        </ResponsiveGridLayout>
    );
};
