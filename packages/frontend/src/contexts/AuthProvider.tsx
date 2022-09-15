import { UserRole } from '@definitions/userTypes';
import { decodeJwt } from '@utils/decodeJwt';
import { ReactNode, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from 'use-local-storage';

import { AppRoute } from '../constants';
import { AuthContext } from './AuthContext';

interface JwtPayload {
    role: UserRole;
}

interface Props {
    children: ReactNode;
}

const parser = (v: string) => v;
const serializer = (v: string | undefined) => String(v);

export const AuthProvider = ({ children }: Props) => {
    const [accessToken, setAccessToken] = useLocalStorage('accessToken', '', {
        parser,
        serializer,
    });
    const navigate = useNavigate();

    // call this function when you want to authenticate the user
    const login = (accessToken: string) => {
        setAccessToken(accessToken);

        // wait for localStorage update
        setTimeout(() => {
            navigate(AppRoute.Home);
        }, 500);
    };

    // call this function to sign out logged in user
    const logout = () => {
        setAccessToken('');
        navigate(AppRoute.Home, { replace: true });
    };

    const value = useMemo(() => {
        if (!accessToken) {
            return {
                accessToken,
                isAdmin: false,
                login,
                logout,
            };
        }

        const decodedAccessToken = decodeJwt<JwtPayload>(accessToken);

        return {
            accessToken,
            isAdmin: decodedAccessToken.role === UserRole.Admin,
            login,
            logout,
        };
    }, [accessToken]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
