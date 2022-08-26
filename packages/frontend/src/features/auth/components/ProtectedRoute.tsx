import { useAuth } from '@hooks/useAuth';
import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

import { AppRoute } from '../../../constants';

interface Props {
    element: ReactElement;
}

export default function ProtectedRoute({ element }: Props) {
    const auth = useAuth();

    if (!auth?.accessToken) {
        return <Navigate to={AppRoute.Auth.SignIn} />;
    }

    return element;
}
