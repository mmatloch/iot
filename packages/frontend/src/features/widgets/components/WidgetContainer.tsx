import { DashboardLayout } from '@definitions/entities/dashboardTypes';
import ReactGridLayout, { Responsive, WidthProvider } from 'react-grid-layout';

import { ResponsiveGridLayoutBreakpoints, ResponsiveGridLayoutCols } from '../../../constants';
import { WidgetCard } from './WidgetCard';

const ResponsiveGridLayout = WidthProvider(Responsive);

const parseLayout = (layout: DashboardLayout[]): ReactGridLayout.Layout[] => {
    return layout.map((entry) => {
        return {
            i: String(entry.widgetId),
            x: entry.positionX,
            y: entry.positionY,
            w: entry.width,
            h: entry.height,
        };
    });
};

interface Props {
    layout: DashboardLayout[];
    onLayoutChange?: (layout: DashboardLayout[]) => void;
}

export const WidgetContainer = ({ layout, onLayoutChange }: Props) => {
    const isEditable = !!onLayoutChange;

    const getWidgetById = (id: number) => {
        const foundLayout = layout.find((entry) => entry.widgetId === id);

        if (foundLayout) {
            return foundLayout.widget;
        }
    };

    const handleLayoutChange = (currentLayout: ReactGridLayout.Layout[]) => {
        if (!onLayoutChange) {
            return;
        }

        const dashboardLayout = currentLayout.reduce((acc, entry) => {
            const id = Number(entry.i);
            const widget = getWidgetById(id);

            if (widget) {
                acc.push({
                    widgetId: id,
                    widget,
                    width: entry.w,
                    height: entry.h,
                    positionX: entry.x,
                    positionY: entry.y,
                });
            }

            return acc;
        }, [] as DashboardLayout[]);

        onLayoutChange(dashboardLayout);
    };

    return (
        <div>
            {/* @ts-expect-error wrong type? */}
            <ResponsiveGridLayout
                className="layout"
                cols={ResponsiveGridLayoutCols}
                breakpoints={ResponsiveGridLayoutBreakpoints}
                layouts={{ lg: parseLayout(layout) }}
                onLayoutChange={handleLayoutChange}
                isDraggable={isEditable}
                isResizable={isEditable}
                rowHeight={10}
            >
                {layout.map((entry) => {
                    return (
                        <div key={entry.widgetId}>
                            <WidgetCard entity={entry.widget} hideEditAction />
                        </div>
                    );
                })}
            </ResponsiveGridLayout>
        </div>
    );
};
