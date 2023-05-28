import { useDashboards } from '@api/dashboardApi';
import FailedToLoadDataDialog from '@components/FailedToLoadDataDialog';
import FullScreenLoader from '@components/FullScreenLoader';
import { Dashboard } from '@definitions/entities/dashboardTypes';
import { WidgetContainer } from '@features/widgets';
import Layout from '@layout/Layout';
import { useEffect, useState } from 'react';

export default function Home() {
    const { data, isLoading, isSuccess } = useDashboards({});
    const [currentDashboard, setCurrentDashboard] = useState<Dashboard>();

    useEffect(() => {
        if (data && !currentDashboard) {
            setCurrentDashboard(data._hits[0]);
        }
    }, [currentDashboard, data]);

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (!isSuccess) {
        return <FailedToLoadDataDialog />;
    }

    return <Layout>{currentDashboard && <WidgetContainer layout={currentDashboard.layout} />}</Layout>;
}
