import { UserRole } from '@definitions/entities/userTypes';
import { decodeJwt } from '@utils/decodeJwt';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
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

const parser = (v: string) => v.replaceAll('\u0000', '');
const serializer = (v: string | undefined) => String(v);

export const AuthProvider = ({ children }: Props) => {
    const [accessToken, setAccessToken] = useLocalStorage('accessToken', '', {
        parser,
        serializer,
    });
    const navigate = useNavigate();

    // call this function when you want to authenticate the user

    const value = useMemo(() => {
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
    }, [accessToken, navigate, setAccessToken]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
