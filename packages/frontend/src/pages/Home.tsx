import { useDashboards } from '@api/dashboardApi';
import { ActionToolbar } from '@components/ActionToolbar';
import FailedToLoadDataDialog from '@components/FailedToLoadDataDialog';
import FullScreenLoader from '@components/FullScreenLoader';
import { Dashboard } from '@definitions/entities/dashboardTypes';
import { useDashboardNavigation, useLiveDashboard } from '@features/dashboards';
import { WidgetContainer } from '@features/widgets';
import Layout from '@layout/Layout';
import { first } from 'lodash';
import { useCallback, useEffect, useState } from 'react';

export default function Home() {
    useLiveDashboard();
    const { data, isLoading, isSuccess } = useDashboards({});
    const [currentDashboard, setCurrentDashboard] = useState<Dashboard>();
    const [currentDashboardIndex, setCurrentDashboardIndex] = useState(-1);

    const dashboards = data?._hits;

    useEffect(() => {
        if (dashboards) {
            if (currentDashboard) {
                const foundDashboard = dashboards.find((dashboard) => currentDashboard._id === dashboard._id);
                if (foundDashboard) {
                    setCurrentDashboard(foundDashboard);
                }
            } else {
                setCurrentDashboard(first(dashboards));
                setCurrentDashboardIndex(0);
            }
        }
    }, [dashboards, currentDashboard]);

    const handlePreviousDashboard = useCallback(() => {
        const newIndex = currentDashboardIndex - 1;

        if (!dashboards || newIndex < 0) {
            return;
        }

        setCurrentDashboard(dashboards[newIndex]);
        setCurrentDashboardIndex(newIndex);
    }, [currentDashboardIndex, dashboards]);

    const handleNextDashboard = useCallback(() => {
        const newIndex = currentDashboardIndex + 1;

        if (!dashboards || newIndex >= dashboards.length) {
            return;
        }

        setCurrentDashboard(dashboards[newIndex]);
        setCurrentDashboardIndex(newIndex);
    }, [currentDashboardIndex, dashboards]);

    const { elementHandlers } = useDashboardNavigation({
        onNextDashboard: handleNextDashboard,
        onPreviousDashboard: handlePreviousDashboard,
    });

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (!isSuccess) {
        return <FailedToLoadDataDialog />;
    }

    return (
        <div {...elementHandlers} style={{ minHeight: '100vh' }}>
            <Layout>
                {currentDashboard && (
                    <>
                        <WidgetContainer layout={currentDashboard.layout} />
                    </>
                )}
            </Layout>
        </div>
    );
}
