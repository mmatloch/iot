import { useDashboard } from '@api/dashboardApi';
import FailedToLoadDataDialog from '@components/FailedToLoadDataDialog';
import FullScreenLoader from '@components/FullScreenLoader';
import { useParams } from 'react-router-dom';

import DashboardEditorPage from './DashboardEditor';

export default function DashboardEditorWrapperPage() {
    const { dashboardId: dashboardIdFromParam } = useParams();
    const dashboardId = Number(dashboardIdFromParam);

    const { data: dashboard, isLoading, isSuccess } = useDashboard(dashboardId);

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (!isSuccess) {
        return <FailedToLoadDataDialog />;
    }

    return <DashboardEditorPage dashboard={dashboard} />;
}
