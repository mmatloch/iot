import { useDashboards, useReorderDashboards } from '@api/dashboardApi';
import { useSnackbar } from 'notistack';
import ReactGridLayout, { Responsive, WidthProvider } from 'react-grid-layout';
import { useTranslation } from 'react-i18next';

import { DashboardCard } from './DashboardCard';

const ResponsiveGridLayout = WidthProvider(Responsive);

const cols = {
    lg: 1,
    md: 1,
    sm: 1,
    xs: 1,
    xxs: 1,
};

export const Dashboards = () => {
    const { t } = useTranslation('dashboards');
    const { data } = useDashboards({});
    const { mutateAsync } = useReorderDashboards();
    const { enqueueSnackbar } = useSnackbar();

    const handleLayoutChange = async (layout: ReactGridLayout.Layout[]) => {
        const dto = layout.map((entry) => {
            return {
                dashboardId: Number(entry.i),
                index: entry.y,
            };
        });

        try {
            await mutateAsync(dto);
        } catch {
            enqueueSnackbar(t('errors.failedToUpdateDashboard'), {
                variant: 'error',
            });
        }
    };

    return (
        <div>
            {/* @ts-expect-error wrong type? */}
            <ResponsiveGridLayout cols={cols} isResizable={false} rowHeight={65} onLayoutChange={handleLayoutChange}>
                {data?._hits.map((dashboard) => (
                    <div key={dashboard._id}>
                        <DashboardCard entity={dashboard} />
                    </div>
                ))}
            </ResponsiveGridLayout>
        </div>
    );
};
