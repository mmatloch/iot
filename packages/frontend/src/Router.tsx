import ProtectedRoute from '@features/auth/components/ProtectedRoute';
import { Route, Routes } from 'react-router-dom';

import { AppRoute } from './constants';
import AuthRedirectGoogle from './pages/AuthRedirectGoogle';
import AuthSignIn from './pages/AuthSignIn';
import DeviceCreator from './pages/DeviceCreator';
import Devices from './pages/Devices';
import EventCreator from './pages/EventCreator';
import EventEditorWrapper from './pages/EventEditorWrapper';
import Events from './pages/Events';
import Home from './pages/Home';
import Users from './pages/Users';

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
        </Routes>
    );
}
