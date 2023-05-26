import { usePreviewWidget } from '@api/widgetsApi';
import FailedToLoadDataDialog from '@components/FailedToLoadDataDialog';
import FullScreenLoader from '@components/FullScreenLoader';
import { WidgetDto } from '@definitions/entities/widgetTypes';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useFormContext } from 'react-hook-form';

import { WidgetCard } from './WidgetCard';

const ResponsiveGridLayout = WidthProvider(Responsive);

const cols = {
    lg: 12,
    md: 6,
    sm: 6,
    xs: 6,
    xxs: 1,
};

const breakpoints = {
    lg: 1900,
    md: 800,
    sm: 768,
    xs: 480,
    xxs: 0,
};

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

    return <WidgetCard widget={widget} />;
};

export const WidgetEditorPreview = () => {
    return (
        <ResponsiveGridLayout className="layout" cols={cols} breakpoints={breakpoints}>
            <div key="1">
                <WidgetEditorPreviewContent />
            </div>
        </ResponsiveGridLayout>
    );
};
