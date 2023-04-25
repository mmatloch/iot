import ProtectedRoute from '@features/auth/components/ProtectedRoute';
import { Route, Routes } from 'react-router-dom';

import { AppRoute } from './constants';
import AuthRedirectGoogle from './pages/AuthRedirectGoogle';
import AuthSignIn from './pages/AuthSignIn';
import DashboardCreatorPage from './pages/DashboardCreator';
import DashboardsPage from './pages/Dashboards';
import DeviceCreator from './pages/DeviceCreator';
import Devices from './pages/Devices';
import EventCreator from './pages/EventCreator';
import EventEditorWrapper from './pages/EventEditorWrapper';
import EventInstances from './pages/EventInstances';
import Events from './pages/Events';
import Home from './pages/Home';
import Scheduler from './pages/Scheduler';
import Users from './pages/Users';
import WidgetsPage from './pages/Widgets';
import WidgetCreatorPage from './pages/WidgetsCreator';

export default function Router() {
    return (
        <Routes>
            <Route index element={<ProtectedRoute element={<Home />} />} />
            <Route path={AppRoute.Auth.SignIn} element={<AuthSignIn />} />
            <Route path={AppRoute.Auth.Redirect.Google} element={<AuthRedirectGoogle />} />
            <Route path={AppRoute.Users} element={<ProtectedRoute element={<Users />} />} />
            <Route path={AppRoute.Events.Root} element={<ProtectedRoute element={<Events />} />} />
            <Route path={AppRoute.Events.Creator} element={<ProtectedRoute element={<EventCreator />} />} />
            <Route path={AppRoute.Events.Editor} element={<ProtectedRoute element={<EventEditorWrapper />} />} />

            <Route path={AppRoute.Devices.Root} element={<ProtectedRoute element={<Devices />} />} />
            <Route path={AppRoute.Devices.Creator} element={<ProtectedRoute element={<DeviceCreator />} />} />

            <Route path={AppRoute.EventScheduler.Root} element={<ProtectedRoute element={<Scheduler />} />} />
            <Route path={AppRoute.EventInstances.Root} element={<ProtectedRoute element={<EventInstances />} />} />

            <Route path={AppRoute.Dashboards.Root} element={<ProtectedRoute element={<DashboardsPage />} />} />
            <Route path={AppRoute.Dashboards.Creator} element={<ProtectedRoute element={<DashboardCreatorPage />} />} />

            <Route path={AppRoute.Widgets.Root} element={<ProtectedRoute element={<WidgetsPage />} />} />
            <Route path={AppRoute.Widgets.Creator} element={<ProtectedRoute element={<WidgetCreatorPage />} />} />
        </Routes>
    );
}
