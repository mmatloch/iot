import { useLocalStorage } from '@hooks/useLocalStorage';
import { ReactNode, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppRoute } from '../constants';
import { AuthContext } from './AuthContext';

interface Props {
    children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
    const [accessToken, setAccessToken] = useLocalStorage('accessToken');
    const navigate = useNavigate();

    // call this function when you want to authenticate the user
    const login = (accessToken: string) => {
        setAccessToken(accessToken);
        navigate(AppRoute.Home);
    };

    // call this function to sign out logged in user
    const logout = () => {
        setAccessToken(undefined);
        navigate(AppRoute.Home, { replace: true });
    };

    const value = useMemo(
        () => ({
            accessToken,
            login,
            logout,
        }),
        [accessToken],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
